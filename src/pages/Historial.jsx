import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { signOut } from "firebase/auth";
import Swal from "sweetalert2";
import instancia from "../../Backend/instancia";

const Historial = () => {
  const navigate = useNavigate();
  const { productName, productCode } = useParams();

  const [result, setResult] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [fecha, setFecha] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');

  const logOut = async () => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro de cerrar sesión?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí",
      });

      if (result.isConfirmed) {
        await signOut(auth);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const postDataHandler = (e) => {
    e.preventDefault();
    const Data = {
      producto: productName, // Usar el productName actual como el nombre del producto
      codigo:productCode,
      cantidad,
      fecha,
      precio
    };

    instancia.post('/Historial.json', Data)
      .then(response => {
        console.log(response);
        fetchHistorial(); 
        clearForm(); 
      })
      .catch(error => {
        console.error('Error al agregar Historial:', error);
      });
  };

  const clearForm = () => {
    setCodigo('');
    setCantidad('');
    setFecha('');
    setPrecio('');
  };

  const fetchHistorial = () => {
    instancia.get('/Historial.json')
      .then(response => {
        console.log(response.data);
        const fetchedHistorial = [];
        for (let key in response.data) {
          fetchedHistorial.unshift({
            ...response.data[key],
            id: key
          });
        }
        setResult(fetchedHistorial.filter(item => item.producto === productName));
      })
      .catch(error => {
        console.error('Error al obtener Historial:', error);
      });
  };

  useEffect(() => {
    fetchHistorial();
  }, [productName]);

  return (
    <div className="container mt-2">
      <div className="salir">
        <button className="btn btn-danger" onClick={logOut}>
          Salir
        </button>
      </div>
      <h2 className="text-center mb-4">Historial de Producto: {productName}</h2>

      <form className="mb-4 formulario" onSubmit={postDataHandler}>
        <div className="mb-3">
          <label className="form-label">Fecha:</label>
          <input type="date" name="fecha" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Producto:</label>
          <input type="text" name="producto" className="form-control" value={productName} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Código:</label>
          <input type="text" name="codigo" className="form-control" value={productCode} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Cantidad:</label>
          <input type="text" name="cantidad" className="form-control" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio:</label>
          <input type="text" name="precio" className="form-control" value={precio} onChange={(e) => setPrecio(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">
          Agregar Producto
        </button>
      </form>

      <table className="table table-bordered text-center">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Código</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {result.map(Historial => (
            <tr key={Historial.id}>
              <td>{Historial.fecha}</td>
              <td>{Historial.codigo}</td>
              <td>{Historial.producto}</td>
              <td>{Historial.cantidad}</td>
              <td>{Historial.precio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Historial;
