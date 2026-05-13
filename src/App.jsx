import React, { useState, useEffect, lazy, Suspense } from "react";

const LoginPageRemota = lazy(() => import("mfe_auth/LoginPage"));

export default function App() {
  const [logado, setLogado] = useState(false);
  const [dadosUsuario, setDadosUsuario] = useState(null);

  //roda apenas uma vez quando a tela abre
  //cura a amnesia - guarda o token no navegador idependentemente se dermos f5
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("meu_token");
    const emailGuardado = localStorage.getItem("meu_email");

    // pula o login se existir um token
    if (tokenGuardado) {
      setLogado(true);
      setDadosUsuario({ 
        emailDoUsuario: emailGuardado, 
        token: tokenGuardado 
      });
    }
  }, []); // essa parte serve para indicar que esse trecho vai rodar uma única vez


  const lidarComSucesso = (pacote) => {
    setLogado(true);
    setDadosUsuario(pacote); 

    // shell vai guardar os dados no navegador
    localStorage.setItem("meu_token", pacote.token);
    localStorage.setItem("meu_email", pacote.emailDigitado);
  };

  // LOGOUT
  const fazerLogout = () => {
    setLogado(false);
    setDadosUsuario(null); 

    // limpar token e email no navegador
    localStorage.removeItem("meu_token");
    localStorage.removeItem("meu_email");
  };

  return (
    <div style={{ fontFamily: 'Arial' }}>
      <header style={{ padding: '10px', background: '#222', color: 'white' }}>
        <h1>Meu Sistema Integrado (Shell)</h1>
      </header>

      <main style={{ padding: '20px' }}>
        {logado ? (
          <div>
            <h2>🚀 Bem-vindo ao Dashboard!</h2>
            <p>
              Você está logado como: 
              <strong style={{ color: 'blue' }}> {dadosUsuario?.emailDigitado}</strong>
            </p>
            <p>Seu token de acesso: <code>{dadosUsuario?.token}</code></p>
            
            <button onClick={fazerLogout}>Fazer Logout</button>
          </div>
        ) : (
          <Suspense fallback={<div>Carregando Tela de Login...</div>}>
            <LoginPageRemota onLoginSucceed={lidarComSucesso} />
          </Suspense>
        )}
      </main>
    </div>
  );
}