import Application from './app';

const PORT = process.env.PORT || 8080;
const appInstance = new Application();

const server = appInstance.start();
try {
  server.listen(PORT, () => {
    console.log(`Listenning on port: ${PORT}`);
  });
} catch (e) {
  console.error(e);
}
