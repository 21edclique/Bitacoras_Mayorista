import React, { useState, useRef, useEffect } from 'react';
import { useBitacoras } from '../hooks/useBitacoras';
import ModalBitacoras from '../Mod/ModalBitacoras';
import jsPDF from 'jspdf';
import PdfPreviewModal from '../Mod/PdfPreviewModal';  // Ajusta la ruta según tu estructura
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Edit2,
  Trash2,
  Printer,
} from 'lucide-react';

const IconButton = ({
  children,
  onClick,
  color = 'default',
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color?: 'default' | 'edit' | 'delete';
  ariaLabel: string;
}) => {
  const colorStyles = {
    default: 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700',
    edit: 'text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900',
    delete: 'text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900',
  };
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${colorStyles[color]}`}
    >
      {children}
    </button>
  );
};

const Bitacoras = () => {
  const {
    bitacoras,
    loading,
    error,
    currentPage,
    itemsPerPage,
    showForm,
    editMode,
    formData,
    handleInputChange,
    handleAddBitacora,
    handleSubmit,
    handleDelete,
    handleEdit,
    paginate,
    setShowForm,
  } = useBitacoras();
  const [userRole, setUserRole] = useState<number | null>(null);

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      const parsedUser = JSON.parse(savedUserData);
      setUserRole(parsedUser.id_rol_per);
    }
  }, []);
  const [goToPage, setGoToPage] = useState('');
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [selectedBitacora, setSelectedBitacora] = useState<any | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const generatePDF = () => {
    if (!selectedBitacora) {
      console.error('No hay bitácora seleccionada.');
      return;
    }

    const pdf = new jsPDF();
    let y = 20; // Posición inicial
    const marginLeft = 15;
    const maxWidth = 180; // Ancho máximo del texto sin desbordamiento
    const lineSpacing = 7; // Espaciado entre líneas
    const pageHeight = pdf.internal.pageSize.height - 20; // Altura máxima antes de nueva página

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('Informe de Bitácora', 105, y, { align: 'center' });
    y += 7;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Sistema de Monitoreo y Control', 105, y, { align: 'center' });
    y += 13;


    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Identificador Bitacora:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${selectedBitacora.id_bitacora} `, marginLeft + 60, y);
    y += lineSpacing;

  
   
    pdf.setFont('helvetica', 'bold');
    pdf.text('Fecha:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String(selectedBitacora.fecha.split('T')[0]), marginLeft + 30, y); // Formatear la fecha
    y += lineSpacing;

    
    pdf.setFont('helvetica', 'bold');
    pdf.text('De:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${selectedBitacora.nombres} `, marginLeft + 30, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Para:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Ing. Jorge Chicaiza (Analista TIC)', marginLeft + 30, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Asunto:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String("Informe diario de Bitácora"), marginLeft + 30, y);
    y += lineSpacing + 5;

    pdf.line(marginLeft, y, 195, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Detalles de la Novedad:', marginLeft, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Hora:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${String(selectedBitacora.hora)}`, marginLeft + 30, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Nave:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${String(selectedBitacora.nombre)}`, marginLeft + 30, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Cámara:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${String(selectedBitacora.camara)}`, marginLeft + 30, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Turno:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${String(selectedBitacora.turno)}`, marginLeft + 30, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Referencia:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${String(selectedBitacora.referencia)}`, marginLeft + 30, y);
    y += lineSpacing;

    pdf.line(marginLeft, y, 195, y);
    y += lineSpacing;

    // Manejo de texto largo en "Novedad"
    pdf.setFont('helvetica', 'bold');
    pdf.text('Descripción:', marginLeft, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'normal');
    const textLines = pdf.splitTextToSize(String(selectedBitacora.novedad), maxWidth);

    for (let i = 0; i < textLines.length; i++) {
      if (y + lineSpacing > pageHeight) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(textLines[i], marginLeft, y);
      y += lineSpacing;
    }

    pdf.line(marginLeft, y, 195, y);
    y += lineSpacing;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Resultado:', marginLeft, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String(selectedBitacora.resultado), marginLeft + 30, y);
    y += lineSpacing * 5;

    // Pie de firma
    if (y + 20 > pageHeight) {
      pdf.addPage();
      y = 20;
    }

    pdf.text('__________________________', 105, y, { align: 'center' });
    pdf.text(String(selectedBitacora.nombres), 105, y + 5, { align: 'center' });
    pdf.setFontSize(10);

    // Pie de página
    pdf.setFontSize(8);
    pdf.text('Documento generado automáticamente - Uso interno', 105, pageHeight - 10, { align: 'center' });

    pdf.save(`Bitacora_${selectedBitacora.id_bitacora}.pdf`);
  };

  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const handlePrintPDF = (bitacora: any) => {
    setSelectedBitacora(bitacora);
    setShowPdfPreview(true);
  };

  const handleDownloadPDF = () => {
    generatePDF();
    setShowPdfPreview(false);
  };

  const closePdfPreview = () => {
    setPdfPreview(null);
    setSelectedBitacora(null);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  // Ordenar bitácoras por fecha descendente (más recientes primero)
  const sortedBitacoras = [...bitacoras].sort((a, b) => b.id_bitacora - a.id_bitacora);
  const totalPages = Math.ceil(sortedBitacoras.length / itemsPerPage);
  const currentItems = sortedBitacoras.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <main className="ml-10 mt-10 p-10 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      <div className="container mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6">
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Bitácoras</h1>
              <button
                onClick={() => {
                  handleAddBitacora();
                  setShowForm(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Agregar Bitácora</span>
              </button>
            </div>

            {/* Contenido */}
            <div className="grid gap-1">
              {currentItems.map((bitacora) => (
                <div
                  key={bitacora.id_bitacora}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                    <div>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        ID:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.id_bitacora}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Fecha:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.fecha.split('T')[0]} {/* Formatear la fecha */}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Usuario:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.nombres}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Hora:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.hora}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Nave:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.nombre}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Cámara:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.camara}
                      </span>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Novedad:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.novedad}
                      </span>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Resultado:
                      </span>
                      <span
                        className={`ml-2 text-gray-900 dark:text-white ${
                          bitacora.resultado === 'Resuelto'
                            ? 'text-green-600 dark:text-green-600'
                            : bitacora.resultado === 'Pendiente'
                            ? 'text-yellow-600 dark:text-yellow-600'
                            : 'text-red-600 dark:text-red-600'
                        }`}
                      >
                        {bitacora.resultado}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Referencia:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.referencia}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Turno:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {bitacora.turno}
                      </span>
                    </div>
                    <div className="flex justify-end md:col-span-2 lg:col-span-1">
                      <div className="flex gap-2">
                        <IconButton
                          onClick={() => handlePrintPDF(bitacora)}
                          color="default"
                          ariaLabel="Imprimir PDF"
                        >
                          <Printer size={18} />
                        </IconButton>
                        {userRole === 1 && (
                          <div className="flex gap-2">
                            <IconButton
                              onClick={() => handleEdit(bitacora)}
                              color="edit"
                              ariaLabel="Editar"
                            >
                              <Edit2 size={18} />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(bitacora.id_bitacora)}
                              color="delete"
                              ariaLabel="Eliminar"
                            >
                              <Trash2 size={18} />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, sortedBitacoras.length)}
                <br />
                de {sortedBitacoras.length} bitácoras | Página {currentPage} de {totalPages}
              </p>

              <nav className="flex items-center gap-2">
                {/* Botón ir a primera página */}
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  <ChevronsLeft size={20} />
                </button>

                {/* Botón ir a página anterior */}
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Botón ir a página siguiente */}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Botón ir a última página */}
                <button
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  <ChevronsRight size={20} />
                </button>

                {/* Input para ir a página específica */}
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={goToPage || currentPage}
                  onChange={(e) => setGoToPage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const pageNumber = parseInt(goToPage);
                      if (pageNumber >= 1 && pageNumber <= totalPages) paginate(pageNumber);
                    }
                  }}
                  className="w-12 text-center border rounded-md bg-gray-100 dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
                />

                {/* Texto "/ totalPages" */}
                <span className="text-sm text-gray-700 dark:text-gray-200">/ {totalPages}</span>
              </nav>
            </div>
          </div>
        </div>

        {/* Modal */}
        <ModalBitacoras
          showForm={showForm}
          editMode={editMode}
          formData={formData}
          setShowForm={setShowForm}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
        {/* PDF Preview Modal */}
        <PdfPreviewModal
          isOpen={showPdfPreview}
          onClose={() => setShowPdfPreview(false)}
          selectedBitacora={selectedBitacora}
          onDownload={handleDownloadPDF}
        />
      </div>
    </main>
  );
};

export default Bitacoras;