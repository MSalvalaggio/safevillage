// Importa i moduli necessari
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const axios = require('axios');

// Connettiti a MongoDB senza le opzioni deprecate
mongoose.connect('mongodb://localhost:27017/safevillage');

// Gestisci gli eventi di connessione
mongoose.connection.on('connected', () => {
  console.log('Connesso al database MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`Errore di connessione: ${err}`);
});

// Definisci uno schema con validazione
const dataSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Il messaggio è obbligatorio'],
    trim: true,
    minlength: [1, 'Il messaggio deve contenere almeno 1 carattere'],
    maxlength: [500, 'Il messaggio non può superare i 500 caratteri'],
    validate: {
      validator: function(v) {
        return typeof v === 'string' && v.length > 0;
      },
      message: props => `${props.value} non è un messaggio valido!`
    }
  }
}, {
  timestamps: true // Aggiunge automaticamente createdAt e updatedAt
});

// Add pre-save middleware for additional validation
dataSchema.pre('save', function(next) {
  if (this.isModified('message')) {
    const validation = this.validateSync();
    if (validation) {
      next(validation);
    }
  }
  next();
});

// Crea un modello basato sullo schema
const DataModel = mongoose.model('Data', dataSchema);

// Crea un'applicazione Express
const app = express();

// Middleware per gestire le richieste JSON
app.use(express.json());

// Middleware per la validazione degli errori
app.use((error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
});

// Configura Express per servire file statici
app.use(express.static(path.join(__dirname, '..', 'public')));

// Definisci una rotta di base
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Rotta per ottenere tutti i dati
app.get('/api/data', async (req, res) => {
  try {
    const data = await DataModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei dati' });
  }
});

// Rotta per inserire nuovi dati
app.post('/api/data', async (req, res) => {
  try {
    const newData = new DataModel({
      message: req.body.message,
    });
    await newData.save();
    res.status(201).json({ message: 'Dato salvato con successo' });
  } catch (error) {
    res.status(500).json({ error: 'Errore nel salvataggio dei dati' });
  }
});

// Rotta per ottenere le informazioni del canale YouTube
app.get('/api/youtube', async (req, res) => {
  try {
    const channelId = 'UCHPszxtOERYU6gzWmBHytJQ';
    const apiKey = 'YOUR_YOUTUBE_API_KEY'; // Sostituisci con la tua chiave API di YouTube
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
    
    const response = await axios.get(url);
    const channelData = response.data.items[0];
    
    res.json(channelData);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero delle informazioni del canale YouTube' });
  }
});

// Rotta per ottenere i video del canale YouTube
app.get('/api/youtube/videos', async (req, res) => {
  try {
    const channelId = 'UCHPszxtOERYU6gzWmBHytJQ';
    const apiKey = 'YOUR_YOUTUBE_API_KEY'; // Sostituisci con la tua chiave API di YouTube
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5`;
    
    const response = await axios.get(url);
    const videos = response.data.items;
    
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei video del canale YouTube' });
  }
});

// Avvia il server sulla porta desiderata
const PORT = process.env.PORT || 3000;
console.log('Avvio del server...');
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});