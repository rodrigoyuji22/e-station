# **Global Solutions - Mobile Dev**
INTEGRANTES: 
Rodrigo Sakaguchi RM88010
Marcelo Kutudjian Filho RM93124


## Descrição 🚗⚡
E-station é um sistema de monitoramento e gerenciamento de recarga de veículos elétricos. Ele oferece uma interface intuitiva para que usuários possam gerenciar e monitorar o carregamento de seus veículos elétricos de forma eficiente. O sistema inclui funcionalidades como login seguro e um dashboard para visualização e controle das atividades de recarga

#  Funcionalidades 🛠️
Login: Sistema de autenticação seguro para acessar o dashboard.
Dashboard: Painel interativo para monitoramento e gestão do carregamento dos veículos elétricos.
Gerenciamento de recarga: Controle de sessões de recarga, histórico e visualização de dados.
Relatórios: Geração de relatórios detalhados sobre o consumo e eficiência de recarga.

# Tecnologias Utilizadas
Front-end:
HTML
CSS
JavaScript
React
Back-end:
Node.js
SQL

# Instalação
*Pré-requisitos*
Certifique-se de ter instalado:
Node.js: Node.js Download
SQL Database (MySQL, PostgreSQL, etc.)

# Clone o repositório:
git clone https://github.com/rodrigoyuji22/E_Station
cd E_Station

#Instale as dependências:
npm install

# Configure o banco de dados SQL com os parâmetros necessários no arquivo de configuração.

# Inicie o servidor:
npm start

# Acesse o sistema no navegador:
http://localhost:3001

# Configure as variáveis de ambiente:
*Configuração do Front-end*
No front-end, crie um arquivo .env com a seguinte variável:
REACT_APP_API_URL=<URL da API do back-end, incluindo a porta configurada no arquivo .env do back-end>

*Configuração do Back-end*
No back-end, crie um arquivo .env com as seguintes variáveis:
JWT_SECRET=<chave secreta para JWT>
PORT=<porta desejada para o servidor back-end>

Lembre-se de substituir <chave secreta para JWT> pela chave que você deseja usar para assinar tokens JWT, e <URL da API do back-end> pela URL completa que inclui o número da porta definida no arquivo .env do back-end.

## Execução

Inicie o back-end:
cd backend
npm start

Inicie o front-end:
cd frontend
npm start
Acesse o sistema no navegador: http://localhost:3001.


# 📄 Licença
Este projeto está licenciado sob a MIT License.
