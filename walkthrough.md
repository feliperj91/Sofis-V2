# Guia de Execução e Verificação

A migração do frontend para React + Vite foi concluída. Siga os passos abaixo para executar o projeto.

## Pré-requisitos

1.  **Node.js**: Certifique-se de que o Node.js está instalado.
2.  **PHP**: O backend requer um servidor PHP rodando.

## Passos para Execução

### 1. Backend API
Inicie o servidor PHP embutido na pasta `backend`:

```bash
cd c:/Users/user/Projetos/Projeto-SOFIS-V2/backend
php -S localhost:8000
```
*Mantenha este terminal aberto.*

### 2. Frontend (Vite)
No diretório `frontend`, instale as dependências (se ainda não terminou) e inicie o servidor:

```bash
cd c:/Users/user/Projetos/Projeto-SOFIS-V2/frontend
npm install
npm run dev
```

Acesse a aplicação em: `http://localhost:5173` (ou a porta indicada no terminal).

## O que foi implementado?

### Módulos
-   **Autenticação**: Login layout e integração.
-   **Dashboard**: Visão geral com estatísticas (Cards).
-   **Usuários**: Listagem, Criação, Edição e Exclusão.
-   **Clientes**: Listagem e gestão básica (Nome, Documento, ISBT).
-   **Produtos**: Gestão completa.
-   **Versões**: Visualização do histórico.
-   **Auditoria**: Visualização de logs.

### Tecnologia
-   **React + Vite**: Performance e desenvolvimento rápido.
-   **Tailwind CSS**: Estilização moderna e responsiva.
-   **Axios**: Cliente HTTP configurado com interceptors para o backend PHP.
-   **React Router**: Navegação SPA (Single Page Application).

## Próximos Passos Sugeridos
1.  Implementar formulários detalhados para os campos complexos de Clientes (Contatos, Servidores, etc).
2.  Adicionar paginação nas tabelas (Auditoria pode ficar lenta com muitos dados).
3.  Refinar o tratamento de erros e feedbacks visuais (Toasts).

## Implantação em nova VM (Via Git)

1.  **Prepare o Repositório no GitHub**:
    -   Crie um novo repositório no GitHub.
    -   Na sua máquina local (onde está este projeto), execute:
        ```bash
        git remote add origin https://github.com/feliperj91/Sofis-V2.git
        git branch -M main
        git push -u origin main
        ```

2.  **Na VM Linux**:
    -   Certifique-se de ter `git` instalado.
    -   Clone o repositório:
        ```bash
        git clone https://github.com/feliperj91/Sofis-V2.git Projeto-SOFIS-V2
        ```

3.  **Configuração do Ambiente**:
    -   **Instale o PHP**: `sudo apt install php php-cli php-pdo php-pgsql` (ajuste conforme seu banco).
    -   **Instale o Node.js (Versão LTS)**:
        O comando `apt install npm` pode instalar uma versão antiga. Recomendo usar o repositório oficial:
        ```bash
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
        ```

4.  **Configuração do Banco de Dados**:
    Como é uma instalação nova, você precisa criar o banco e as tabelas:
    ```bash
    # Alternar para o usuário postgres
    sudo su - postgres

    # Criar usuário e banco do projeto
    psql -c "CREATE USER sofis_user WITH PASSWORD 'sofis123';"
    psql -c "CREATE DATABASE sofis_v2 OWNER sofis_user;"
    
    # Sair do usuário postgres
    exit
    
    # Importar as tabelas (Estando na pasta raiz do projeto)
    psql -U sofis_user -d sofis_v2 -h localhost -f backend/database/init.sql
    ```
    *(A senha solicitada será `sofis123`)*

5.  **Instalação de Dependências**:
    Na pasta `frontend`, execute:
    ```bash
    npm install
    ```

6.  **Execução**:
    -   Inicie o backend: `php -S 0.0.0.0:8000` (na pasta backend).
    -   Inicie o frontend: `npm run dev -- --host` (na pasta frontend).
    -   Acesse pelo IP da VM.

## Solução de Problemas Comuns

### Erro: `sh: 1: vite: not found`
Se você ver este erro ao rodar `npm run dev`, significa que as dependências não foram instaladas corretamente.
1.  Garanta que você está na pasta `frontend`.
2.  Rode:
    ```bash
    rm -rf node_modules
    npm install
    ```
3.  Tente rodar o servidor novamente.

### Acesso via Windows (VirtualBox)
Se você usa VirtualBox com rede NAT e não consegue acessar pelo navegador do Windows:
1.  Vá em **Configurações > Rede > Avançado > Redirecionamento de Portas**.
2.  Adicione estas regras (não mexa na regra 8080 se já existir):
    *   **Frontend**: TCP | Host 3000 -> Guest 3000
    *   **Backend**: TCP | Host 8000 -> Guest 8000
3.  Acesse `http://localhost:3000`.

### Erro de Autenticação no Banco (FATAL: password authentication failed)
Se mesmo com a senha correta você não conseguir conectar no banco, pode ser necessário ajustar as permissões locais o Postgres:

1.  Edite a configuração: `sudo nano /etc/postgresql/*/main/pg_hba.conf`
2.  Mude as linhas de conexão local de `md5` ou `peer` para `trust`:
    ```
    # TYPE  DATABASE        USER            ADDRESS                 METHOD
    local   all             all                                     trust
    host    all             all             0.0.0.0/0               trust
    ```
3.  Reinicie o serviço: `sudo service postgresql restart`

## Automatização (Rodar Automaticamente)

Para não precisar abrir dois terminais toda vez, criei um script `start.sh`.

### Opção 1: Rodar manualmente com um comando
1.  Atualize o repositório na VM: `git pull`
2.  Dê permissão de execução: `chmod +x start.sh`
3.  Rode: `./start.sh`

### Opção 2: Rodar SEMPRE ao ligar a VM (Systemd)
Para iniciar automaticamente com o Linux, crie um serviço:

1.  Crie o arquivo de serviço:
    ```bash
    sudo nano /etc/systemd/system/sofis.service
    ```

2.  Cole o conteúdo abaixo (ajuste o caminho `/home/felipe/Projeto-SOFIS-V2` para o **seu** caminho real, use `pwd` para verificar):
    ```ini
    [Unit]
    Description=Projeto SOFIS V2
    After=network.target

    [Service]
    Type=simple
    User=felipe
    WorkingDirectory=/home/felipe/Projeto-SOFIS-V2
    ExecStart=/bin/bash /home/felipe/Projeto-SOFIS-V2/start.sh
    Restart=always

    [Install]
    WantedBy=multi-user.target
    ```

3.  Ative o serviço:
    ```bash
    sudo systemctl daemon-reload
    sudo systemctl enable sofis
    sudo systemctl start sofis
    ```
    *Agora o sistema vai subir sozinho sempre que ligar a VM!*
