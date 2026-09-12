# AMT | Sistemas de Monitoria e Gestão

Portal institucional da **Agência Metropolitana de Transportes (AMT)** que centraliza o acesso aos sistemas de monitoria e gestão dos transportes da Área Metropolitana de Maputo:

- Transporte Escolar
- Transporte BMM
- Transportes Municipais (Gestão de Activos / Relatórios)
- Transporte Intermodal

Este portal **não substitui** os sistemas existentes — funciona apenas como ponto de encaminhamento seguro para cada plataforma externa, que abre num novo separador.

## Requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm (incluído com o Node.js)

## Como executar em desenvolvimento

```bash
npm install
npm run dev
```

Abre depois o endereço indicado no terminal (por omissão [http://localhost:5173](http://localhost:5173)).

## Compilar para produção

```bash
npm run build
```

Os ficheiros optimizados são gerados em `dist/`. Para pré-visualizar essa compilação localmente:

```bash
npm run preview
```

## Verificar o código (lint)

```bash
npm run lint
```

## Estrutura do projecto

```
src/
  assets/images/       Fotografias dos serviços e logótipo da AMT
  components/          Componentes de UI (cabeçalho, hero, cartões, modais, ícones)
  config/services.ts   Configuração central: títulos, descrições, imagens e URLs de destino
  index.css            Estilos globais e tokens de cor da identidade AMT
  App.tsx              Composição da página
```

### Alterar destinos ou textos dos serviços

Todos os dados dos 4 cartões (título, descrição, imagem, URL de destino) estão centralizados em [`src/config/services.ts`](src/config/services.ts). O serviço **Transportes Municipais** usa `options` em vez de `href`, o que faz o botão "Aceder ao sistema" abrir um modal de escolha entre "Gestão de Activos" e "Relatórios".

## Notas de segurança

- Nenhuma credencial, senha ou token é armazenado ou apresentado neste portal.
- Todos os acessos aos sistemas externos abrem em novo separador (`target="_blank"`) com `rel="noopener noreferrer"`.
- Não são usados `iframe`s, dado que os sistemas externos podem bloquear incorporação.
