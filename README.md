## Setup steps

1. `nvm install` to install the proper node version
2. `npm install -g yarn` to make sure you have yarn installed
3. `yarn` to install all necessary dependencies
4. `yarn dev` to run it on your local machine



## Features

- Default nextjs app with tailwind/shadcn to build faster
- Main search page hooked up to a simple search endpoint for some fixed opensea slugs
- On selection of a slug we use dynamic routes to show a collection page with the collection info
- For collection page we use server components to render content out faster (faster TTI metrics)
- The nft grid we fetch data once user has loaded the page, we leverage infinite scrolling here with tanstack + intersection observer
- We also introduce wagmi/viem to allow user to connect their wallet
- Once user has connected their wallet they can turn on buy mode and potentially buy an NFT (Doesn't work for all as some are auctions and some aren't on ethereum)