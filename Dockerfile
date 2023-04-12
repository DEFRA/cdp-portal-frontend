ARG PARENT_VERSION=2.1.2-node18.11.0
ARG PORT=3000
ARG PORT_DEBUG=9229

FROM defradigital/node-development:${PARENT_VERSION} AS development
ARG PARENT_VERSION
LABEL uk.gov.defra.ffc.parent-image=defradigital/node-development:${PARENT_VERSION}

ARG PORT
ARG PORT_DEBUG
ENV PORT ${PORT}
EXPOSE ${PORT} ${PORT_DEBUG}

COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .
RUN npm run build

CMD [ "npm", "run", "start:watch" ]

FROM defradigital/node:${PARENT_VERSION} AS production
ARG PARENT_VERSION
LABEL uk.gov.defra.ffc.parent-image=defradigital/node:${PARENT_VERSION}

COPY --from=development /home/node/src/ ./src/
COPY --from=development /home/node/package*.json ./
COPY --from=development /home/node/.public/ ./.public/

RUN npm ci --only=production

ARG PORT
ENV PORT ${PORT}
EXPOSE ${PORT}

CMD [ "node", "src/index.js" ]
