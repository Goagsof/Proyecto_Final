
const express = require("express");
const { Usuario, agregarUsuario, obtenerUsuarios } = require('./mongo_config/mongo_config');
const { Producto, agregarProducto, obtenerProductos, comprarProducto, abastecerDespensa,modificarProducto,eliminarProducto,buscarProducto } = require('./mongo_config/mongo_productos');
const bcrypt = require('bcrypt');

const app = express();

app.set('views','./vistas');
app.set('view engine', 'ejs');

app.use(express.static('./estilos'));
app.use(express.urlencoded({ extended: true }));

app.listen('8000', () => {
    console.log('aplicacion en puerto 8000');
});

app.get('/', (req, res) => {
    res.render('./principal/login.pug');
});

//redireccionamientos

app.get('/login', (req, res) => {
    res.render('./principal/login.pug');
});

app.get('/registrar', (req, res) => {
    res.render('./principal/registrar.pug');
});

app.get('/principal', (req, res) => {
    res.render('./principal/principal.pug');
});

app.get('/comprar', (req, res) => {
    res.render('./principal/comprar.pug');
});

app.get('/vender', (req, res) => {
    res.render('./principal/vender.pug');
});

app.get('/abastecer', (req, res) => {
    res.render('./principal/abastecer.pug');
});

app.get('/ingresar', (req, res) => {
    res.render('./productos/ingresar.pug');
});

app.get('/modificar', (req, res) => {
    res.render('./productos/modificar.pug');
});

app.get('/buscar', (req, res) => {
    res.render('./productos/buscar.pug');
});

app.get('/eliminar', (req, res) => {
    res.render('./productos/eliminar.pug');
});

app.get('/eliminar', (req, res) => {
    res.render('./productos/eliminar.pug');
});

app.get('/ingresar_usuario', (req, res) => {
    res.render('./usuarios/ingresar_usuario.pug');
});

app.get('/modificar_usuario', (req, res) => {
    res.render('./usuarios/modificar_usuario.pug');
});

app.get('/buscar_usuario', (req, res) => {
    res.render('./usuarios/buscar_usuario.pug');
});

app.get('/eliminar_usuario', (req, res) => {
    res.render('./usuarios/eliminar_usuario.pug');
});



//--Metodos--//
app.post('/agregar', (req, res) => {
    agregarUsuario(req, res);
});

app.post('/agregar_producto', (req, res) => {
    agregarProducto(req, res);
});

app.post('/validar_login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const usuarios = await obtenerUsuarios(Usuario);
        const usuarioEncontrado = usuarios.find(u => u.nombre === username);

        if (usuarioEncontrado) {
            const esContraseñaCorrecta = await bcrypt.compare(password, usuarioEncontrado.contraseña);

            if (esContraseñaCorrecta) {
                console.log('incorrecto');
                res.render('./principal/login.pug');
            } else {
                console.log('correcto');
                res.render('./principal/principal.pug', { mensaje: 'Contraseña correcta.' });
            }
        } else {
            res.render('./principal/login.pug', { mensaje: 'Usuario no encontrado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

app.post('/comprar_producto', async (req, res) => {
    const { nombreProducto, cantidadComprada } = req.body;
  
    try {
      const resultadoCompra = await comprarProducto(nombreProducto, cantidadComprada);
  
      if (resultadoCompra.success) {
        res.render('./principal/comprar.pug', { mensaje: resultadoCompra.message });
      } else {
        res.render('./principal/comprar.pug', { mensaje: resultadoCompra.message });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
    }
  });

app.post('/abastecer_despensa', async (req, res) => {
  const { nombreProducto, cantidadAbastecida } = req.body;

  try {
    const resultadoAbastecimiento = await abastecerDespensa(nombreProducto, cantidadAbastecida);

    if (resultadoAbastecimiento.success) {
      res.render('./principal/abastecer.pug', { mensaje: resultadoAbastecimiento.message });
    } else {
      res.render('./principal/abastecer.pug', { mensaje: resultadoAbastecimiento.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

app.post('/modificar_producto', async (req, res) => {
    const { nombreProductoActual, nuevoNombre, nuevaDescripcion, nuevaCantidad, nuevoPrecio } = req.body;
  
    try {
      const resultadoModificacion = await modificarProducto(nombreProductoActual, nuevoNombre, nuevaDescripcion, nuevaCantidad, nuevoPrecio);
  
      if (resultadoModificacion.success) {
        res.render('./productos/modificar.pug', { mensaje: resultadoModificacion.message });
      } else {
        res.render('./productos/modificar.pug', { mensaje: resultadoModificacion.message });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
    }
});

app.post('/eliminar_producto', async (req, res) => {
    const { nombreProducto } = req.body;
  
    try {
      const resultadoEliminacion = await eliminarProducto(nombreProducto);
  
      if (resultadoEliminacion.success) {
        res.render('./productos/eliminar.pug', { mensaje: resultadoEliminacion.message });
      } else {
        res.render('./productos/eliminar.pug', { mensaje: resultadoEliminacion.message });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
    }
});

app.post('/buscar_producto', async (req, res) => {
    const { nombreProducto } = req.body;
  
    try {
      const resultadoBusqueda = await buscarProducto(nombreProducto);
      if (resultadoBusqueda.success) {
        res.render('./productos/detalles_producto.pug', { producto: resultadoBusqueda.producto });
      } else {
        res.render('./productos/buscar.pug', { mensaje: resultadoBusqueda.message });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
    }
});

app.get('/tabla_productos', async (req, res) => {
    try {
      const productos = await obtenerProductos(Producto);
  
      res.render('./tabla_productos.pug', { productos });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
    }
  });