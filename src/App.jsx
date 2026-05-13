import React, { useState, useEffect, lazy, Suspense } from "react";

// importa as mfe
const LoginPageRemota = lazy(() => import("mfe_auth/LoginPage"));
const RegisterPageRemota = lazy(() => import("mfe_auth/RegisterPage"));

export default function App() {
  const [logado, setLogado] = useState(false);
  const [dadosUsuario, setDadosUsuario] = useState(null);
  
  // a tela atual vai começar como a de login
  const [telaAtual, setTelaAtual] = useState("login");

  useEffect(() => {
    const tokenGuardado = localStorage.getItem("meu_token");
    const emailGuardado = localStorage.getItem("meu_email");

    if (tokenGuardado) {
      setLogado(true);
      setDadosUsuario({ emailDigitado: emailGuardado, token: tokenGuardado });
    }
  }, []);

  const lidarComSucesso = (pacote) => {
    setLogado(true);
    setDadosUsuario(pacote); 
    //console.log("O que o backend enviou:", pacote);

    localStorage.setItem("meu_token", pacote.token);
    localStorage.setItem("meu_refresh", pacote.refresh);
    localStorage.setItem("meu_email", pacote.emailDigitado); 
  };

  // Nova função para quando o usuário criar a conta
  const lidarComCadastro = (pacote) => {
    //console.log("O que o backend enviou:", pacote);
    alert(`Sucesso! O usuário ${pacote.novoEmail} (${pacote.cargo}) foi criado no sistema.`);
    //após criar a conta, vai voltar para a tela de login
    setTelaAtual("login"); 
  };

  const fazerLogout = async () => {
    try {
      const tokenAcesso = localStorage.getItem("meu_token"); 
      const tokenRefresh = localStorage.getItem("meu_refresh");

      // so vai tentar fazer isso se realmente esitver com os tokens(boa pratica)
      if (tokenAcesso && tokenRefresh) {
        await fetch("http://localhost:3001/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // mostra como cracha para mostrar que é valido e assim nao tomar erro 401 na cara
            "Authorization": `Bearer ${tokenAcesso}` 
          },
          // vai mandar o token de refresh para o banco deletar
          body: JSON.stringify({ refresh: tokenRefresh }) 
        });
      }
    } catch (error) {
      console.error("erro ao comuniar o sevidor, fazendo logout local no navegador:", error);
    } finally {
      setLogado(false);
      setDadosUsuario(null); 
      setTelaAtual("login"); 
      
      //limpeza manual e local
      localStorage.removeItem("meu_token");
      localStorage.removeItem("meu_refresh");
      localStorage.removeItem("meu_email");
    }
  };

  return (
    <div style={{ fontFamily: 'Arial' }}>
      <header style={{ padding: '10px', background: '#222', color: 'white' }}>
        <h1>Meu Sistema Integrado (Shell)</h1>
      </header>

      <main style={{ padding: '20px' }}>
        {logado ? (
          <div>
            <h2> Login bem sucedido!!!</h2>
            <p>
              Você está logado como: 
              <strong style={{ color: 'blue' }}> {dadosUsuario?.emailDigitado}</strong>
            </p>
            <p>Seu token de acesso: <code>{dadosUsuario?.token}</code></p>
            
            <button onClick={fazerLogout}>Fazer Logout</button>
          </div>
        ) : (
          <Suspense fallback={<div>Carregando os módulos do sistema...</div>}>
            
            {/* CANAL DA TELA DE LOGIN */}
            {telaAtual === "login" && (
              <LoginPageRemota 
                onLoginSucceed={lidarComSucesso} 
                onIrParaCadastro={() => setTelaAtual("cadastro")} // Troca o canal
              />
            )}

            {/* CANAL DA TELA DE CADAASTRO*/}
            {telaAtual === "cadastro" && (
              <RegisterPageRemota 
                onRegisterSucceed={lidarComCadastro} 
                onVoltar={() => setTelaAtual("login")} // Volta o canal
              />
            )}

          </Suspense>
        )}
      </main>
    </div>
  );
}