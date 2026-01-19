# Automação Zuumapp Wave 2

Este é um projeto de automação de testes end-to-end (E2E) utilizando [Playwright](https://playwright.dev/). O projeto cobre cenários de teste para diferentes perfis de usuário, incluindo Broker, Carrier e Super Admin.

## Estrutura do Projeto

- **features/**: Arquivos de funcionalidades (Gherkin).
- **pageObjects/**: Implementação do padrão Page Object Model (POM) para abstração das páginas.
- **tests/**: Arquivos de teste (`.spec.ts`) organizados por perfil e funcionalidade.
  - `broker/`: Testes específicos para o perfil Broker.
  - `carrier/`: Testes específicos para o perfil Carrier.
  - `superAdmin/`: Testes específicos para o perfil Super Admin.
- **playwright.config.ts**: Configuração global do Playwright.

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

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente (baseado nas configurações existentes):

```env
BASE_URL_BROKER=https://admin-new.fedexcc-dev.zuumapp.com
BASE_URL_SUPERADMIN=https://stage-super-admin.zuumapp.com
BASE_URL_CARRIER=https://carrier.fedexcc-dev.zuumapp.com

BROKER_USER_EMAIL=seu_email_broker
BROKER_USER_PASSWORD=sua_senha_broker

CARRIER_USER_EMAIL=seu_email_carrier
CARRIER_USER_PASSWORD=sua_senha_carrier

SUPERADMIN_USER_EMAIL=seu_email_superadmin
SUPERADMIN_USER_PASSWORD=sua_senha_superadmin
```

## Executando os Testes

Para executar todos os testes:

```bash
npx playwright test
```

Para executar os testes com interface gráfica (modo headed):

```bash
npx playwright test --ui
```

Para ver o relatório HTML após a execução:

```bash
npx playwright show-report
```

## Estrutura dos Testes

Os testes estão localizados na pasta `tests/` e utilizam Page Objects da pasta `pageObjects/` para interagir com a aplicação.

Exemplo de estrutura de teste (`tests/broker/login/loginStageBroker.spec.ts`):
- Utiliza `LoginPage` para realizar o login.
- Verifica o redirecionamento correto.
- Salva o estado de armazenamento (storage state) para reutilização de sessão.
