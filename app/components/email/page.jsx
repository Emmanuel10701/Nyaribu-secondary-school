'use client';
import { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiSend,
  FiUsers,
  FiBarChart2,
  FiEye,
  FiMail,
  FiX,
  FiSave,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiRotateCw,
  FiCheck,
  FiUser,
  FiAward,
  FiShield,
  FiBook,
  FiInfo,
  FiBell
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Box, CircularProgress } from '@mui/material';

// Modern Notification System with Sooner-like design
function ModernNotificationSystem() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const mockNotifications = [
    {
      id: 1,
      type: 'email',
      title: 'Campaign Sent Successfully',
      message: '"Monthly Newsletter" sent to 250 recipients',
      time: '5 minutes ago',
      read: false,
      icon: FiSend
    },
    {
      id: 2,
      type: 'draft',
      title: 'Draft Saved',
      message: '"Parent Meeting Reminder" saved as draft',
      time: '2 hours ago',
      read: false,
      icon: FiSave
    },
    {
      id: 3,
      type: 'system',
      title: 'New Recipients Added',
      message: '15 new parent emails added to database',
      time: '1 day ago',
      read: true,
      icon: FiUser
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-xl bg-white border border-gray-200 shadow-sm cursor-pointer"
      >
        <FiBell className="text-xl text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Email Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 font-medium cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-xl border border-gray-200">
                    <notification.icon className={`text-lg ${
                      notification.type === 'email' ? 'text-green-600' :
                      notification.type === 'draft' ? 'text-blue-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-gray-900 text-sm">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-gray-600 text-xs mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-blue-600 font-medium cursor-pointer"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Modern Campaign Detail Modal
function ModernCampaignDetailModal({ campaign, onClose }) {
  if (!campaign) return null;

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '95vh', bgcolor: 'background.paper',
        borderRadius: 3, boxShadow: 24, overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%)'
      }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <FiMail className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Campaign Details</h2>
                <p className="text-blue-100 opacity-90 mt-1">
                  Complete overview of email campaign
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl cursor-pointer">
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(95vh-200px)] overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
                <p className="text-lg text-gray-600 italic mb-4">{campaign.subject}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiInfo className="text-blue-600" />
                  Campaign Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      campaign.status === 'published' ? 'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status === 'published' ? 'Sent' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipient Group:</span>
                    <span className="text-gray-900 font-bold capitalize">{campaign.recipientType || 'All'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipients:</span>
                    <span className="text-gray-900 font-bold">{campaign.recipientCount || campaign.recipients?.split(',').length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-900 font-bold">
                      {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  {campaign.sentAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sent:</span>
                      <span className="text-gray-900 font-bold">{new Date(campaign.sentAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiBook className="text-green-600" />
                Email Content
              </h3>
              <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-6 border border-gray-200">
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {campaign.content}
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Preview */}
            {campaign.recipients && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FiUsers className="text-purple-600" />
                  Recipient List
                </h3>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {campaign.recipients.split(',').map((email, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-sm text-gray-700 truncate">{email.trim()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm text-gray-600">
                    Total: {campaign.recipients.split(',').length} recipients
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-center">
            <button 
              onClick={onClose} 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

// Modern Email Campaign Card Component
function ModernCampaignCard({ campaign, onEdit, onDelete, onView, onSend }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800 text-lg mb-2 line-clamp-2 cursor-pointer"
                onClick={() => onView(campaign)}>
              {campaign.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{campaign.subject}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            campaign.status === 'published' ? 'bg-green-100 text-green-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            {campaign.status === 'published' ? 'Sent' : 'Draft'}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              <FiUsers className="text-xs" />
              <span>{campaign.recipientCount || campaign.recipients?.split(',').length || 0} recipients</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 font-bold">
              <FiCalendar className="text-xs" />
              <span>
                {campaign.sentAt 
                  ? new Date(campaign.sentAt).toLocaleDateString()
                  : new Date(campaign.createdAt).toLocaleDateString()
                }
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-lg font-bold">
              {campaign.recipientType || 'All'}
            </span>
            {campaign.status === 'published' && (
              <span className="text-green-600 font-bold flex items-center gap-1">
                <FiCheck className="text-xs" /> Sent
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onView(campaign)} 
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-xl shadow-md cursor-pointer text-xs font-bold"
            >
              View
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {campaign.status === 'draft' && (
              <button 
                onClick={() => onSend(campaign)} 
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-xl shadow-md cursor-pointer text-xs font-bold"
              >
                Send
              </button>
            )}
            <button 
              onClick={() => onEdit(campaign)} 
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-3 py-2 rounded-xl shadow-md cursor-pointer text-xs font-bold"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(campaign.id)} 
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-xl shadow-md cursor-pointer text-xs font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmailManager() {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
    recipients: 'all',
    status: 'draft'
  });

  // Fetch emails from APIs
  const fetchEmails = async () => {
    try {
      const studentRes = await fetch('/api/student');
      const studentData = await studentRes.json();
      const students = studentData.success ? studentData.students || studentData.data || [] : [];
      const parentEmails = students
        .filter(s => s.parentEmail && s.parentEmail.trim() !== '')
        .map(s => s.parentEmail.trim());

      const staffRes = await fetch('/api/staff');
      const staffData = await staffRes.json();
      const staff = staffData.success ? staffData.staff || staffData.data || [] : [];

      const teachingStaff = staff.filter(s => 
        s.role === 'Teacher' || 
        s.department === 'Sciences' || 
        s.department === 'Mathematics' || 
        s.department === 'Languages' || 
        s.department === 'Humanities' ||
        s.department === 'Sports'
      );

      const administrativeStaff = staff.filter(s => 
        s.role === 'Principal' || 
        s.role === 'Deputy Principal' ||
        s.department === 'Administration'
      );

      const bomMembers = staff.filter(s => 
        s.role === 'BOM Member' || 
        (s.position && s.position.toLowerCase().includes('board'))
      );

      const supportStaff = staff.filter(s => 
        s.role === 'Support Staff' || 
        s.role === 'Librarian' || 
        s.role === 'Counselor' ||
        (!teachingStaff.includes(s) && !administrativeStaff.includes(s) && !bomMembers.includes(s))
      );

      const teacherEmails = teachingStaff.map(s => s.email).filter(email => email && email.trim() !== '');
      const adminEmails = administrativeStaff.map(s => s.email).filter(email => email && email.trim() !== '');
      const bomEmails = bomMembers.map(s => s.email).filter(email => email && email.trim() !== '');
      const supportEmails = supportStaff.map(s => s.email).filter(email => email && email.trim() !== '');
      const allStaffEmails = staff.map(s => s.email).filter(email => email && email.trim() !== '');

      setStudents(students);
      setStaff(staff);

      return {
        parentEmails,
        teacherEmails,
        adminEmails,
        bomEmails,
        supportEmails,
        allStaffEmails
      };
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Error fetching email data');
      return {
        parentEmails: [],
        teacherEmails: [],
        adminEmails: [],
        bomEmails: [],
        supportEmails: [],
        allStaffEmails: []
      };
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const campaignsRes = await fetch('/api/emails');
      const campaignsData = await campaignsRes.json();
      
      if (campaignsData.success) {
        setCampaigns(campaignsData.campaigns || campaignsData.data || []);
      } else {
        toast.error('Failed to fetch campaigns');
      }

      await fetchEmails();
      toast.success('Data loaded successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  // Recipient groups
  const recipientGroups = [
    { 
      value: 'all', 
      label: 'All Recipients', 
      count: calculateTotalRecipients(),
      color: 'blue',
      description: 'All parents and staff members',
      icon: FiUsers
    },
    { 
      value: 'parents', 
      label: 'Parents Only', 
      count: students.filter(s => s.parentEmail && s.parentEmail.trim() !== '').length,
      color: 'green',
      description: 'All parent email addresses',
      icon: FiUser
    },
    { 
      value: 'teachers', 
      label: 'Teaching Staff', 
      count: staff.filter(s => 
        s.role === 'Teacher' || 
        ['Sciences', 'Mathematics', 'Languages', 'Humanities', 'Sports'].includes(s.department)
      ).length,
      color: 'purple',
      description: 'All teaching staff members',
      icon: FiBook
    },
    { 
      value: 'administration', 
      label: 'Administration', 
      count: staff.filter(s => 
        s.role === 'Principal' || 
        s.role === 'Deputy Principal' ||
        s.department === 'Administration'
      ).length,
      color: 'orange',
      description: 'Principal, Deputy Principals, and administrative staff',
      icon: FiAward
    },
    { 
      value: 'bom', 
      label: 'Board of Management', 
      count: staff.filter(s => 
        s.role === 'BOM Member' || 
        (s.position && s.position.toLowerCase().includes('board'))
      ).length,
      color: 'red',
      description: 'Board of Management members',
      icon: FiShield
    },
    { 
      value: 'support', 
      label: 'Support Staff', 
      count: staff.filter(s => 
        s.role === 'Support Staff' || 
        s.role === 'Librarian' || 
        s.role === 'Counselor'
      ).length,
      color: 'indigo',
      description: 'Librarians, counselors, and support staff',
      icon: FiUsers
    },
    { 
      value: 'staff', 
      label: 'All Staff', 
      count: staff.filter(s => s.email && s.email.trim() !== '').length,
      color: 'cyan',
      description: 'All teaching, administrative, and support staff',
      icon: FiUsers
    }
  ];

  function calculateTotalRecipients() {
    const parentEmails = students.filter(s => s.parentEmail && s.parentEmail.trim() !== '').length;
    const staffEmails = staff.filter(s => s.email && s.email.trim() !== '').length;
    return parentEmails + staffEmails;
  }

  const getRecipientEmails = (recipientType) => {
    let emails = [];
    
    switch (recipientType) {
      case 'parents':
        emails = students
          .map(s => s.parentEmail)
          .filter(email => email && email.trim() !== '')
          .map(email => email.trim());
        break;
        
      case 'teachers':
        emails = staff
          .filter(s => 
            s.role === 'Teacher' || 
            ['Sciences', 'Mathematics', 'Languages', 'Humanities', 'Sports'].includes(s.department)
          )
          .map(s => s.email)
          .filter(email => email && email.trim() !== '')
          .map(email => email.trim());
        break;
        
      case 'administration':
        emails = staff
          .filter(s => 
            s.role === 'Principal' || 
            s.role === 'Deputy Principal' ||
            s.department === 'Administration'
          )
          .map(s => s.email)
          .filter(email => email && email.trim() !== '')
          .map(email => email.trim());
        break;
        
      case 'bom':
        emails = staff
          .filter(s => 
            s.role === 'BOM Member' || 
            (s.position && s.position.toLowerCase().includes('board'))
          )
          .map(s => s.email)
          .filter(email => email && email.trim() !== '')
          .map(email => email.trim());
        break;
        
      case 'support':
        emails = staff
          .filter(s => 
            s.role === 'Support Staff' || 
            s.role === 'Librarian' || 
            s.role === 'Counselor'
          )
          .map(s => s.email)
          .filter(email => email && email.trim() !== '')
          .map(email => email.trim());
        break;
        
      case 'staff':
        emails = staff
          .map(s => s.email)
          .filter(email => email && email.trim() !== '')
          .map(email => email.trim());
        break;
        
      case 'all':
      default:
        emails = [
          ...students
            .map(s => s.parentEmail)
            .filter(email => email && email.trim() !== '')
            .map(email => email.trim()),
          ...staff
            .map(s => s.email)
            .filter(email => email && email.trim() !== '')
            .map(email => email.trim())
        ];
        break;
    }
    
    return [...new Set(emails)];
  };

  // Filtering and pagination
  useEffect(() => {
    let filtered = campaigns;

    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.recipientType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === selectedStatus);
    }

    setFilteredCampaigns(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, campaigns]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCampaigns = filteredCampaigns.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // CRUD Operations
  const handleCreate = () => {
    setFormData({
      title: '',
      subject: '',
      content: '',
      recipients: 'all',
      status: 'draft'
    });
    setEditingCampaign(null);
    setShowModal(true);
  };

  const handleEdit = (campaign) => {
    setFormData({
      title: campaign.title,
      subject: campaign.subject,
      content: campaign.content,
      recipients: campaign.recipientType || 'all',
      status: campaign.status
    });
    setEditingCampaign(campaign);
    setShowModal(true);
  };

  const handleView = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDetailModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this email campaign?')) {
      try {
        const response = await fetch(`/api/emails?id=${id}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.success) {
          setCampaigns(campaigns.filter(campaign => campaign.id !== id));
          toast.success('Campaign deleted successfully!');
        } else {
          toast.error(result.error || 'Failed to delete campaign');
        }
      } catch (error) {
        console.error('Error deleting campaign:', error);
        toast.error('Error deleting campaign');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const recipientEmails = getRecipientEmails(formData.recipients);
      
      if (recipientEmails.length === 0) {
        toast.error('No recipients found for the selected group. Please check your data.');
        return;
      }

      const campaignData = {
        title: formData.title,
        subject: formData.subject,
        content: formData.content,
        recipients: recipientEmails.join(', '),
        status: formData.status,
        recipientType: formData.recipients,
        recipientCount: recipientEmails.length,
        sentAt: formData.status === 'published' ? new Date().toISOString() : null
      };

      let response;
      if (editingCampaign) {
        response = await fetch(`/api/emails?id=${editingCampaign.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(campaignData),
        });
      } else {
        response = await fetch('/api/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(campaignData),
        });
      }

      const result = await response.json();

      if (result.success) {
        await fetchData();
        setShowModal(false);
        toast.success(`Campaign ${editingCampaign ? 'updated' : 'created'} successfully!`);
      } else {
        toast.error(result.error || `Failed to ${editingCampaign ? 'update' : 'create'} campaign`);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Error creating campaign');
    }
  };

  const handleSendNow = async (campaign) => {
    if (confirm(`Send this campaign to ${campaign.recipients.split(',').length} recipients?`)) {
      setSending(true);
      try {
        const response = await fetch(`/api/emails?id=${campaign.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...campaign,
            status: 'published',
            sentAt: new Date().toISOString()
          }),
        });
        
        const result = await response.json();
        
        if (result.success) {
          await fetchData();
          toast.success('Campaign sent successfully!');
        } else {
          toast.error(result.error || 'Failed to send campaign');
        }
      } catch (error) {
        console.error('Error sending campaign:', error);
        toast.error('Error sending campaign');
      } finally {
        setSending(false);
      }
    }
  };

  // Stats calculation
  const stats = [
    { 
      label: 'Total Campaigns', 
      value: campaigns.length.toString(), 
      icon: FiMail, 
      color: 'blue' 
    },
    { 
      label: 'Sent Campaigns', 
      value: campaigns.filter(c => c.status === 'published').length.toString(), 
      icon: FiSend, 
      color: 'green' 
    },
    { 
      label: 'Draft Campaigns', 
      value: campaigns.filter(c => c.status === 'draft').length.toString(), 
      icon: FiSave, 
      color: 'purple' 
    },
    { 
      label: 'Total Recipients', 
      value: calculateTotalRecipients().toString(), 
      icon: FiUsers, 
      color: 'orange' 
    }
  ];

  // Audience overview
  const audienceOverview = [
    { label: 'Total Parents', value: students.filter(s => s.parentEmail && s.parentEmail.trim() !== '').length },
    { label: 'Teaching Staff', value: staff.filter(s => s.role === 'Teacher' || ['Sciences', 'Mathematics', 'Languages', 'Humanities', 'Sports'].includes(s.department)).length },
    { label: 'Administration', value: staff.filter(s => s.role === 'Principal' || s.role === 'Deputy Principal' || s.department === 'Administration').length },
    { label: 'BOM Members', value: staff.filter(s => s.role === 'BOM Member' || (s.position && s.position.toLowerCase().includes('board'))).length },
    { label: 'Support Staff', value: staff.filter(s => s.role === 'Support Staff' || s.role === 'Librarian' || s.role === 'Counselor').length },
    { label: 'Total Audience', value: calculateTotalRecipients() }
  ];

  // Modern Loading Spinner
  const ModernLoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="text-center">
        <CircularProgress size={60} className="text-blue-600" />
        <div className="mt-4 space-y-2">
          <span className="block text-xl font-semibold text-gray-700">
            Loading email campaigns...
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <ModernLoadingSpinner />;
  }

  return (
    <div className="space-y-6 p-4 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Header with Notification Bell */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg border border-blue-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Email Campaign Manager</h1>
            <p className="text-gray-600 text-sm lg:text-base">Create and manage email campaigns for school communication</p>
          </div>
          <div className="flex items-center gap-3">
            <ModernNotificationSystem />
            <button onClick={fetchData} className="flex items-center gap-2 bg-gray-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl font-bold shadow-lg cursor-pointer text-sm">
              <FiRotateCw className={`text-xs ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={handleCreate} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl font-bold shadow-lg cursor-pointer text-sm">
              <FiPlus className="text-xs" /> New Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">{stat.label}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <stat.icon className="text-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Compose with Campaign Title */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FiMail className="text-blue-600" />
            Quick Compose
          </h2>
          
          <div className="space-y-6">
            {/* Campaign Title Field - Added */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-200">
                <FiBook className="text-blue-600" /> 
                Campaign Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="Enter campaign title"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">Recipients *</label>
              <select 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                value={formData.recipients}
                onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
              >
                {recipientGroups.map(group => (
                  <option key={group.value} value={group.value}>
                    {group.label} ({group.count})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">Subject *</label>
              <input
                type="text"
                placeholder="Enter email subject"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">Email Content *</label>
              <textarea
                rows="6"
                placeholder="Write your email content here..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 resize-none"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg cursor-pointer"
                onClick={() => {
                  setFormData({ ...formData, status: 'draft' });
                  handleSubmit({ preventDefault: () => {} });
                }}
              >
                Save Draft
              </button>
              <button 
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg cursor-pointer"
                onClick={() => {
                  setFormData({ ...formData, status: 'published' });
                  handleSubmit({ preventDefault: () => {} });
                }}
              >
                Send Now
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Recipient Groups */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiUsers className="text-blue-600" />
              Recipient Groups
            </h3>
            <div className="space-y-3">
              {recipientGroups.map(group => (
                <div
                  key={group.value}
                  className={`flex items-center justify-between p-3 border-2 ${
                    formData.recipients === group.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  } rounded-xl cursor-pointer`}
                  onClick={() => setFormData({ ...formData, recipients: group.value })}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <group.icon className={`text-${group.color}-500 text-sm`} />
                      <span className="font-bold text-gray-700 text-sm">{group.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">{group.description}</p>
                  </div>
                  <span className={`bg-${group.color}-100 text-${group.color}-800 px-2 py-1 rounded-full text-xs font-bold`}>
                    {group.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Audience Overview */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiBarChart2 className="text-green-600" />
              Audience Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {audienceOverview.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm font-bold text-gray-600 mb-1">{item.label}</p>
                  <p className="text-xl font-bold text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns by title or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 cursor-pointer text-sm"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Sent</option>
          </select>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {currentCampaigns.map((campaign) => (
            <ModernCampaignCard 
              key={campaign.id} 
              campaign={campaign}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onSend={handleSendNow}
            />
          ))}
        </div>

        {/* Empty State */}
        {currentCampaigns.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiMail className="text-4xl lg:text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No campaigns found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first email campaign to get started'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredCampaigns.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-sm text-gray-700 font-medium">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCampaigns.length)} of {filteredCampaigns.length} campaigns
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <FiChevronLeft className="text-lg" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => paginate(page)}
                      className={`px-3 py-2 rounded-xl font-bold ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                          : 'text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <FiChevronRight className="text-lg" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDetailModal && selectedCampaign && (
        <ModernCampaignDetailModal 
          campaign={selectedCampaign} 
          onClose={() => setShowDetailModal(false)} 
        />
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  <FiX className="text-xl text-gray-600" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-200">
                  <FiBook className="text-blue-600" /> 
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  placeholder="Enter campaign title"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">Email Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  placeholder="Enter email subject"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">Recipient Group *</label>
                <select
                  required
                  value={formData.recipients}
                  onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {recipientGroups.map(group => (
                    <option key={group.value} value={group.value}>
                      {group.label} ({group.count} recipients)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">Email Content *</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows="8"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 resize-none"
                  placeholder="Write your email content here..."
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status === 'draft'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'draft' : 'published' })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-bold text-gray-700">Save as Draft</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg cursor-pointer"
                >
                  {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}