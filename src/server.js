const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const cors = require('cors');
const UserController = require('./controllers/UserController');
const ProductController = require('./controllers/ProductControler');
const SupportController = require('./controllers/SupportController');
const multer = require('multer');
const express = require('express');
const app = express();
const upload = multer({ dest: 'uploads/' });


// Middleware para JSON e CORS
app.use(express.json());
app.use(cors());

// Configuração de sessão com armazenamento em SQLite
app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite', dir: './src/sessions' }),
    secret: '4r&$fSE59Vuz5i59STP5qj',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, maxAge: 24 * 60 * 60 * 1000 }, 
  })
);

// Rotas
app.post('/login', UserController.login);
app.post('/register', UserController.createUser);
app.post('/products', upload.single('image'), ProductController.createProduct);
app.post('/updateUser/:id', UserController.updateUser);
app.post('/support', SupportController.createSupportRequest);
app.get('/support', SupportController.listSupportRequests);
app.put('/support', SupportController.updateSupportStatus);
app.get('/sales', ProductController.listSales);
app.post('/sales', ProductController.createSale);

app.get('/settings', async (req, res) => {
  if (!req.session.userId) {
      return res.redirect('/login');  // Redireciona se o usuário não estiver logado
  }

  try {
      // Busca as informações do usuário com base no ID armazenado na sessão
      const user = await User.findById(req.session.userId);
      if (!user) {
          return res.status(404).send('Usuário não encontrado.');
      }

      // Renderiza a página de configurações e passa os dados do usuário para o template
      res.render('settings', {
          userId: user.id,
          nameUser: user.nameUser,
          companyName: user.companyName,
          cnpj: user.cnpj,
          telephone: user.telephone,
          address: user.address,
          neighborhood: user.neighborhood,
          cep: user.cep,
          city: user.city,
          uf: user.uf
      });
  } catch (error) {
      console.error('Erro ao carregar as configurações do usuário:', error);
      res.status(500).send('Erro ao carregar as configurações do usuário.');
  }
});

app.get('/settings', (req, res) => {
  if (!req.session.userId) {
      return res.redirect('/login');  
  }

  res.render('settings.html', { userId: req.session.userId });
});

// Iniciar servidor
app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
