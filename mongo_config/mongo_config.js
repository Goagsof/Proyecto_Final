const mongoose = require('mongoose');

const {Schema} = mongoose;

// Utiliza process.env.MONGODB_URI para acceder a la variable de entorno
const connect = process.env.MONGODB_URI || 'mongodb://localhost/ProyectoF';

mongoose.connect(connect, { useNewUrlParser: true, useUnifiedTopology: true });


const usuarioSchema = new Schema ({
    nombre: String,
    contraseña : String,
    correo : String
});

const Usuario = mongoose.model('usuarios',usuarioSchema);

const agregarUsuario = (req, res)=>{
    const usuario = new Usuario({
        nombre: req.body.nombre,
        contraseña: req.body.contraseña,
        correo: req.body.correo
    });
    usuario.save()
    .then(re => {
        res.redirect('/');
    });
};

const obtenerUsuarios = async (modelo) => {
    try {
        const usuarios = await modelo.find({});
        return usuarios;
    } catch (error) {
        throw error;
    }
};

module.exports = { Usuario, agregarUsuario,obtenerUsuarios };