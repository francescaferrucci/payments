import { useState, useEffect } from 'react';
import MakePaymentForm from './MakePaymentForm';
import SchedulePaymentForm from './SchedulePaymentForm';
import PaymentPlanForm from './PaymentPlanForm';
import RefundModal from './RefundModal';

const PaymentModalContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [invoiceId, setInvoiceId] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  
  useEffect(() => {
    const handleOpenModal = (event) => {
      const { actionType, invoiceId } = event.detail;
      setModalType(actionType);
      setInvoiceId(invoiceId);
      setIsOpen(true);
      fetchInvoiceDetails(invoiceId);
    };
    
    const handleOpenRefundModal = (event) => {
      const { invoiceId } = event.detail;
      setModalType('refund');
      setInvoiceId(invoiceId);
      setIsOpen(true);
      fetchInvoiceDetails(invoiceId);
    };
    
    window.addEventListener('openPaymentModal', handleOpenModal);
    window.addEventListener('openRefundModal', handleOpenRefundModal);
    
    return () => {
      window.removeEventListener('openPaymentModal', handleOpenModal);
      window.removeEventListener('openRefundModal', handleOpenRefundModal);
    };
  }, []);
  
  const fetchInvoiceDetails = async (id) => {
    try {
      const response = await fetch(`/api/invoices/${id}`);
      const data = await response.json();
      setInvoiceDetails(data);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    }
  };
  
  const closeModal = () => {
    setIsOpen(false);
    setModalType(null);
    setInvoiceId(null);
    setInvoiceDetails(null);
  };
  
  const renderModalContent = () => {
    if (!modalType || !invoiceDetails) return null;
    
    switch(modalType) {
      case 'pay_now':
        return <MakePaymentForm invoiceId={invoiceId} invoiceDetails={invoiceDetails} onClose={closeModal} />;
      case 'schedule':
        return <SchedulePaymentForm invoiceId={invoiceId} invoiceDetails={invoiceDetails} onClose={closeModal} />;
      case 'payment_plan':
        return <PaymentPlanForm invoiceId={invoiceId} invoiceDetails={invoiceDetails} onClose={closeModal} />;
      case 'refund':
        return <RefundModal invoiceId={invoiceId} invoiceDetails={invoiceDetails} onClose={closeModal} />;
      default:
        return null;
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={closeModal}
          aria-hidden="true"
        ></div>
        
        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={closeModal}
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
          
          {renderModalContent()}
        </div>
      </div>
    </div>
  );
};

export default PaymentModalContainer;
