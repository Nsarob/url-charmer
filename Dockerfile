FROM node:20-alpine AS build

ENV YARN_VERSION=4.3.1

WORKDIR /usr/src/app

RUN corepack enable && corepack prepare yarn@${YARN_VERSION}

COPY package.json ./
COPY yarn.lock ./
COPY .yarn ./.yarn

COPY .yarnrc.yml ./

RUN yarn install --immutable --immutable-cache

# Copy all files from the current directory to the docker directory
COPY . .

# Build the application to get the dist folder
RUN yarn build


FROM node:20-alpine AS production

# Set the NODE_ENV to production explicitly
ENV NODE_ENV=production YARN_VERSION=4.3.1

WORKDIR /usr/src/app

# install and use yarn 4.x
RUN corepack enable && corepack prepare yarn@${YARN_VERSION}

COPY package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY .yarn ./.yarn

# Install only production dependencies
RUN yarn install --immutable --immutable-cache --production

# Copy the built application from the build stage to the working directory
COPY --from=build /usr/src/app/dist ./dist


EXPOSE 3000
EXPOSE 80

# Copy the entrypoint script to the image
COPY entrypoint.sh /usr/src/app/entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /usr/src/app/entrypoint.sh


# Run the app
CMD ["./entrypoint.sh"]

# CMD ["node", "dist/src/index.js"]








