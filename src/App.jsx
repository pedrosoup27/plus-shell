import React, { useState, useEffect, lazy, Suspense } from "react";

// Importando os dois "Canais" do seu MFE
const LoginPageRemota = lazy(() => import("mfe_auth/LoginPage"));
const RegisterPageRemota = lazy(() => import("mfe_auth/RegisterPage"));

export default function App() {
  const [logado, setLogado] = useState(false);
  const [dadosUsuario, setDadosUsuario] = useState(null);
  
  // A TV do Shell: começa no canal de "login"
  const [telaAtual, setTelaAtual] = useState("login");

  useEffect(() => {
    const tokenGuardado = localStorage.getItem("meu_token");
    const emailGuardado = localStorage.getItem("meu_email");

    if (tokenGuardado) {
      setLogado(true);
      // Mantendo o padrão que você usou no MFE (emailDigitado)
      setDadosUsuario({ emailDigitado: emailGuardado, token: tokenGuardado });
    }
  }, []);

  const lidarComSucesso = (pacote) => {
    setLogado(true);
    setDadosUsuario(pacote); 

    localStorage.setItem("meu_token", pacote.token);
    // Salvamos a propriedade com o nome exato que o seu Login envia
    localStorage.setItem("meu_email", pacote.emailDigitado); 
  };

  // Nova função para quando o usuário criar a conta
  const lidarComCadastro = (pacote) => {
    alert(`Sucesso! O usuário ${pacote.novoEmail} (${pacote.cargo}) foi criado no sistema.`);
    // Após criar a conta, mandamos ele de volta para a tela de Login para digitar a senha
    setTelaAtual("login"); 
  };

  const fazerLogout = () => {
    setLogado(false);
    setDadosUsuario(null); 
    setTelaAtual("login"); // Ao sair, garante que a TV volta pro Login
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
          <Suspense fallback={<div>Carregando os módulos do sistema...</div>}>
            
            {/* CANAL 1: TELA DE LOGIN */}
            {telaAtual === "login" && (
              <LoginPageRemota 
                onLoginSucceed={lidarComSucesso} 
                onIrParaCadastro={() => setTelaAtual("cadastro")} // Troca o canal
              />
            )}

            {/* CANAL 2: TELA DE CADASTRO */}
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