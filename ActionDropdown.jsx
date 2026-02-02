import { useState, useEffect } from 'react';

const ActionDropdown = ({ invoiceId, invoiceStatus, invoiceAmount }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [availableActions, setAvailableActions] = useState([]);
  
  // Fetch available actions based on invoice status
  useEffect(() => {
    const fetchAvailableActions = async () => {
      try {
        const response = await fetch(`/api/invoices/${invoiceId}/available-actions`);
        const data = await response.json();
        setAvailableActions(data.actions);
      } catch (error) {
        console.error('Error fetching available actions:', error);
        // Set default actions based on status
        setAvailableActions(getDefaultActions(invoiceStatus));
      }
    };
    
    fetchAvailableActions();
  }, [invoiceId, invoiceStatus]);
  
  // Determine which actions should be available
  const getDefaultActions = (status) => {
    const actions = [];
    
    if (status !== 'PAID' && status !== 'REFUNDED') {
      actions.push('pay_now');
      actions.push('schedule');
      actions.push('payment_plan');
    }
    
    // Always available
    actions.push('view_details');
    
    if (status === 'PAID') {
      actions.push('refund');
    }
    
    return actions;
  };
  
  const handleAction = async (actionType) => {
    setShowDropdown(false);
    
    switch(actionType) {
      case 'pay_now':
        window.openPaymentModal('pay_now', invoiceId);
        break;
      case 'schedule':
        window.openPaymentModal('schedule', invoiceId);
        break;
      case 'payment_plan':
        window.openPaymentModal('payment_plan', invoiceId);
        break;
      case 'view_details':
        window.openInvoiceDetails(invoiceId);
        break;
      case 'refund':
        window.openRefundModal(invoiceId);
        break;
      default:
        console.warn('Unknown action:', actionType);
    }
  };
  
  const getActionLabel = (action) => {
    const labels = {
      'pay_now': 'Pay Now',
      'schedule': 'Schedule Payment',
      'payment_plan': 'Payment Plan',
      'view_details': 'View Details',
      'refund': 'Process Refund',
      'edit': 'Edit Invoice'
    };
    return labels[action] || action;
  };
  
  const isActionDisabled = (action) => {
    if (action === 'pay_now' && (invoiceStatus === 'PAID' || invoiceStatus === 'REFUNDED')) {
      return true;
    }
    if (action === 'refund' && invoiceStatus !== 'PAID') {
      return true;
    }
    return false;
  };
  
  return (
    <div className="relative actions-dropdown">
      <button
        type="button"
        className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-expanded={showDropdown}
        aria-haspopup="true"
      >
        Actions <span className="ml-1">▼</span>
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-1">
            {/* Payment Actions */}
            {availableActions.includes('pay_now') && (
              <button
                onClick={() => handleAction('pay_now')}
                disabled={isActionDisabled('pay_now')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${isActionDisabled('pay_now') ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
              >
                Pay Now
              </button>
            )}
            
            {availableActions.includes('schedule') && (
              <button
                onClick={() => handleAction('schedule')}
                disabled={isActionDisabled('schedule')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${isActionDisabled('schedule') ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
              >
                Schedule Payment
              </button>
            )}
            
            {availableActions.includes('payment_plan') && (
              <button
                onClick={() => handleAction('payment_plan')}
                disabled={isActionDisabled('payment_plan')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${isActionDisabled('payment_plan') ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
              >
                Payment Plan
              </button>
            )}
            
            {/* Separator */}
            {(availableActions.includes('pay_now') || availableActions.includes('schedule') || availableActions.includes('payment_plan')) && 
             (availableActions.includes('view_details') || availableActions.includes('refund')) && (
              <div className="border-t border-gray-100 my-1"></div>
            )}
            
            {/* Other Actions */}
            {availableActions.includes('view_details') && (
              <button
                onClick={() => handleAction('view_details')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                View Details
              </button>
            )}
            
            {availableActions.includes('refund') && (
              <button
                onClick={() => handleAction('refund')}
                disabled={isActionDisabled('refund')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-red-50 ${isActionDisabled('refund') ? 'text-gray-400 cursor-not-allowed' : 'text-red-700'}`}
              >
                Process Refund
              </button>
            )}
            
            {availableActions.includes('edit') && (
              <button
                onClick={() => handleAction('edit')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit Invoice
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;
