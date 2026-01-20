# Automação Zuumapp Wave 2

Este é um projeto de automação de testes end-to-end (E2E) utilizando [Playwright](https://playwright.dev/). O projeto cobre o ciclo de vida completo de cargas (Shipments) na plataforma, validando interações entre diferentes perfis de usuário: Broker, Carrier e Super Admin.

## Funcionalidades Principais

- **Ciclo Completo de Carga**: Criação pelo Broker, Aceite e Entrega pelo Carrier (com upload de POD), e Aprovação final pelo Broker.
- **Page Object Model (POM)**: Estrutura modular para facilitar a manutenção e reutilização de código.
- **Documentação Bilíngue**: O código fonte (Page Objects e Testes) possui comentários em Português e Inglês para acessibilidade.


## Estrutura do Projeto

- **features/**: Arquivos de funcionalidades (Gherkin/BDD).
- **pageObjects/**: Classes que representam as páginas da aplicação (POM).
  - `ftlShipmentPage.ts`: Ações relacionadas a criação e gerenciamento de cargas FTL.
  - `carrierJobPage.ts`: Ações do Carrier (aceite, updates de status, upload de POD).
  - `loginPage.ts`: Abstração do login para diferentes perfis.
- **tests/**: Arquivos de teste (`.spec.ts`).
  - `broker/`: Testes específicos do Broker.
  - `carrier/`: Testes específicos do Carrier.
  - `superAdmin/`: Testes específicos do Super Admin.
  - `e2e/`: Testes de integração de ponta a ponta (Fluxos completos).
- **uplodfile/**: Arquivos utilizados para testes de upload (ex: `POD.jpg`).
- **playwright.config.ts**: Configuração global do framework.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node)

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd Automacao-Wesley
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Instale os navegadores do Playwright:
   ```bash
   npx playwright install
   ```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```env
# URLs dos Ambientes
BASE_URL_BROKER=https://admin-new.fedexcc-dev.zuumapp.com
BASE_URL_SUPERADMIN=https://stage-super-admin.zuumapp.com
BASE_URL_CARRIER=https://carrier.fedexcc-dev.zuumapp.com

# Credenciais Broker
BROKER_USER_EMAIL=seu_email_broker
BROKER_USER_PASSWORD=sua_senha_broker

# Credenciais Carrier
CARRIER_USER_EMAIL=seu_email_carrier
CARRIER_USER_PASSWORD=sua_senha_carrier

# Credenciais Super Admin
SUPERADMIN_USER_EMAIL=seu_email_superadmin
SUPERADMIN_USER_PASSWORD=sua_senha_superadmin
```

## Executando os Testes

### Executar todos os testes
```bash
npx playwright test
```

### Executar o Fluxo E2E Completo (Recomendado)
Este teste executa o ciclo completo: Broker Cria -> Carrier Entrega -> Broker Aprova.
```bash
npx playwright test tests/e2e/brokerCreatesCarrierDeliversBrokerApproves.spec.ts
```

### Executar com Interface Gráfica (UI Mode)
Útil para debugar e ver o teste rodando passo a passo.
```bash
npx playwright test --ui
```

### Visualizar Relatórios
Após a execução, um relatório HTML é gerado.
```bash
npx playwright show-report
```

## Dicas de Desenvolvimento

- **Comentários**: Ao editar Page Objects, mantenha o padrão de comentários bilíngues (Português/Inglês).
- **Timeouts**: O teste E2E completo possui um timeout estendido (10 minutos) devido à complexidade do fluxo.
- **Uploads**: Certifique-se de que o arquivo de teste para upload (ex: `POD.jpg`) existe no caminho esperado ou utilize arquivos dummy se configurado.
