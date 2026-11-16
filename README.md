# 🍽️ GourmetPOS - Sistema de Gestão para Restaurantes (SaaS)

O **GourmetPOS** é uma solução de Ponto de Venda (PDV) e Gestão de Salão com arquitetura *Mobile-First*, desenhada para operar no modelo SaaS (Software as a Service). O foco do sistema é eliminar o uso de papel, agilizar o atendimento dos garçons e dar controle financeiro em tempo real para os donos de restaurantes.

🚀 **Acesse o Sistema ao Vivo:** <https://gourmet-pos-sooty.vercel.app/>

## 📱 Principais Funcionalidades

### 🤵 Para o Garçom (Visão Mobile)

* **Design Focado em Agilidade:** Comanda no estilo *Bottom Sheet* (gaveta inferior) para não tampar os botões do cardápio em telas pequenas.

* **Mapeamento de Mesas por Cores:**

  * 🟢 **Verde:** Livre

  * 🟡 **Amarelo:** Ocupada

  * 🔴 **Vermelho:** Fechamento de Conta (Travada por segurança)

* **Lançamento de Pedidos:** Separação lógica entre Cozinha (Comidas) e Copa/Bar (Bebidas).

* **Alerta de Lotação:** Aviso visual automático quando o salão atinge 70% de ocupação.

* **Justificativa de Cancelamento:** Exigência de motivo para cancelar itens, gerando auditoria.

### 👨‍💼 Para o Dono/Gerente (Visão Desktop/Tablet)

* **Dashboard (CRM):** Acompanhamento em tempo real das vendas do dia e **auditoria rigorosa de cancelamentos** com foco em evitar prejuízos.

* **Controle de Estoque em 1 Clique:** Botão para marcar pratos como "Esgotado", removendo-os imediatamente da tela de todos os garçons.

* **Gestão de Cardápio Dinâmica:** Adição, edição e exclusão de categorias e pratos direto pelo sistema.

* **Gestão de Equipe:** Cadastro e remoção de garçons, com geração de PINs únicos de 4 dígitos para login.

* **Caixa e Recebimento:** Fechamento de mesas com cálculo automático de taxa de serviço (10%).

## 🛠️ Tecnologias Utilizadas

O projeto foi construído focando em alta performance e escalabilidade futura:

* **Frontend:** React.js (Vite)

* **Estilização:** Tailwind CSS

* **Ícones:** Lucide React

* **Hospedagem atual:** Vercel (CI/CD Automático)

* **Arquitetura Base:** Preparado para integração Serverless (Firebase Firestore) e envio de dados para QZ Tray (Impressoras Térmicas ESC/POS).

## 💻 Como rodar o projeto localmente

Se você deseja clonar o repositório e rodar o projeto na sua máquina:

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

2. Clone este repositório:

   ```
   git clone https://github.com/SEU_USUARIO/gourmet-pos.git
   
   ```

3. Acesse a pasta do projeto:

   ```
   cd gourmet-pos
   
   ```

4. Instale as dependências:

   ```
   npm install
   
   ```

5. Inicie o servidor de desenvolvimento:

   ```
   npm run dev
   
   ```

6. O sistema estará rodando em `http://localhost:5173`

## 🔒 Dados de Acesso (Modo Teste)

Para testar a aplicação no link ao vivo, utilize as seguintes credenciais fictícias (PIN de 4 dígitos):

* **Acesso Gerencial (Admin):**

  * **Usuário:** Dono (Admin)

  * **PIN:** `0000`

* **Acesso Garçom (Lari ou Gusta):**

  * **Usuários:** Lari (Garçom) ou Gusta (Garçom)

  * **PIN:** `1234` ou `5678`

*Desenvolvido com 💡 focado em revolucionar a gestão gastronômica.*
