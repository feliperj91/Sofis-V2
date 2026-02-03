import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        version_type: 'Pacote'
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products.php');
            setProducts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Falha ao carregar produtos', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                version_type: product.version_type || 'Pacote'
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                version_type: 'Pacote'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products.php?id=${editingProduct.id}`, formData);
            } else {
                await api.post('/products.php', formData);
            }
            fetchProducts();
            handleCloseModal();
        } catch (error) {
            alert('Erro ao salvar produto: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await api.delete(`/products.php?id=${id}`);
                fetchProducts();
            } catch (error) {
                alert('Erro ao excluir: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Produtos</h1>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Produto
                </Button>
            </div>

            <Card>
                <div className="p-4 border-b border-gray-200">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Buscar por nome..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-medium">
                            <tr>
                                <th className="px-6 py-4">Nome do Produto</th>
                                <th className="px-6 py-4">Tipo de Versão</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="3" className="px-6 py-8 text-center">Carregando...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan="3" className="px-6 py-8 text-center">Nenhum produto encontrado.</td></tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                                            <Package className="h-4 w-4 mr-2 text-gray-400" />
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4">{product.version_type}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => handleOpenModal(product)} className="text-indigo-600 hover:text-indigo-900" title="Editar">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900" title="Excluir">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nome do Produto"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Versão</label>
                        <select
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            value={formData.version_type}
                            onChange={(e) => setFormData({ ...formData, version_type: e.target.value })}
                        >
                            <option value="Pacote">Pacote</option>
                            <option value="Compilação">Compilação</option>
                            <option value="Release">Release</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Products;
