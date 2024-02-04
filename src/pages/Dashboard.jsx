import { auth } from "../config/firebase";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { db } from "../config/firebase";
import { collection, addDoc, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Swal from 'sweetalert2';

const Registration = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    movieTitle: "",
    author: "",
  });

  const [editingItem, setEditingItem] = useState(null);

  const itemsCollectionRef = collection(db, "movies");

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async () => {
    try {

      if (!formData.movieTitle || !formData.author) {
        Swal.fire({
          icon: 'error',
          title: 'Campos Vacíos',
          text: 'Por favor, complete ambos campos.',
        });
        return;
      }

      if (editingItem) {
        // Editar el elemento existente
        const itemDocRef = doc(db, "movies", editingItem.id);
        await updateDoc(itemDocRef, formData);
        setEditingItem(null);
        Swal.fire({
          icon: 'success',
          title: 'La película se ha editado correctamente',
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        // Agregar un nuevo elemento
        Swal.fire({
          icon: 'success',
          title: 'Registro Exitoso',
          text: 'La película se ha agregado correctamente.',
          showConfirmButton: false,
          timer: 2000,
        });
        await addDoc(itemsCollectionRef, formData);
      }

      setFormData({
        movieTitle: "",
        author: "",
      });

      fetchItems();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al subir datos',
        text: error,
      });
      console.log('Error al subir datos', error);
    }
  }

  const editItem = (item) => {
    setFormData({
      movieTitle: item.movieTitle,
      author: item.author,
    });
    setEditingItem(item);
  }

  const deleteItem = async (itemId) => {
    try {
      // Mostrar SweetAlert de confirmación
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminarlo'
      });
  
      if (result.isConfirmed) {
        // Usuario hizo clic en "Sí, eliminarlo"
        const itemDocRef = doc(db, "movies", itemId);
        await deleteDoc(itemDocRef);
        fetchItems();
        Swal.fire({
          icon: 'success',
          title: 'Elemento eliminado',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.log('Error al eliminar el elemento', error);
    }
  }
  

  const fetchItems = async () => {
    setLoading(true);
    const q = query(collection(db, "movies"), orderBy("movieTitle"));
    const querySnapshot = await getDocs(q);

    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isActive: doc.data().isActive ?? true }));
    setItems(items);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setFormData({
      movieTitle: "",
      author: "",
    });
  }

  const logOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    
    <div className="container mt-2">
      <div className="salir">
      <button className="btn btn-danger" onClick={logOut}>Salir</button>
      </div>
      <h2 className="text-center mb-4">Lista de Películas</h2>

      <form  onSubmit={(e) => { e.preventDefault(); addItem(); }} className="mb-4 formulario">
        <div className="mb-3">
          <label className="form-label">Título de la Película:</label>
          <input type="text" name="movieTitle" value={formData.movieTitle} onChange={handleInputChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Autor:</label>
          <input type="text" name="author" value={formData.author} onChange={handleInputChange} className="form-control" />
        </div>
        {editingItem ? (
          <div>
            <button type="button" className="btn btn-secondary me-2" onClick={cancelEdit}>Cancelar Edición</button>
            <button type="submit" className="btn btn-primary">Guardar Cambios</button>
          </div>
        ) : (
          <button type="submit" className="btn btn-primary">Agregar Película</button>
        )}
      </form>

      <table className="table table-bordered text-center">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.movieTitle}</td>
              <td>{item.author}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => editItem(item)}>Editar</button>
                <button className="btn btn-danger" onClick={() => deleteItem(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
 </div>
  );
};

export default Registration;
