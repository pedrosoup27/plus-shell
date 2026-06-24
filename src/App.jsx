import React, { lazy, Suspense } from "react";

//importa mfe de consulta
const ConsultaPecasRemota = lazy(() => import("consultaApp/ConsultaPecas"));

export default function App() {
  return (
    <div style={{ fontFamily: 'Arial', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      
      {/* HEADER DO SHELL */}
      <header style={{ padding: '15px 20px', background: '#222', color: 'white' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Meu Sistema Integrado (Shell)</h1>
      </header>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main style={{ padding: '20px' }}>
        
        
        <Suspense fallback={<div>Carregando módulo de consulta...</div>}>
          <ConsultaPecasRemota />
        </Suspense>

      </main>
    </div>
  );
}