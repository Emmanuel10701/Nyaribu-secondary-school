'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiMail,
  FiPhone,
  FiUser,
  FiAward,
  FiBook,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiX,
  FiMapPin,
  FiCalendar,
  FiBriefcase,
  FiEye,
  FiStar,
  FiShield,
  FiRotateCw,
  FiUpload
} from 'react-icons/fi';
import { 
  IoPeopleCircle,
  IoRocketOutline,
  IoSchoolOutline
} from 'react-icons/io5';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import your local avatar images
import male from "../../../images/avata/male.png";
import female from "../../../images/avata/female.png";

export default function StaffManager() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newExpertise, setNewExpertise] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    role: 'Teacher',
    position: '',
    department: 'Sciences',
    email: '',
    phone: '',
    image: '',
    bio: '',
    responsibilities: [],
    expertise: [],
    achievements: [],
    status: 'active'
  });

  // Available roles and departments based on your API structure
  const roles = ['Principal', 'Deputy Principal', 'Teacher', 'BOM Member', 'Support Staff', 'Librarian', 'Counselor'];
  const departments = ['Sciences', 'Mathematics', 'Languages', 'Humanities', 'Administration', 'Sports', 'Guidance'];

  // Fetch staff from API
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/staff');
      const data = await response.json();
      
      if (data.success) {
        setStaff(data.staff || []);
        setFilteredStaff(data.staff || []);
      } else {
        console.error('Failed to fetch staff:', data.error);
        setStaff([]);
        setFilteredStaff([]);
        toast.error('Failed to fetch staff data');
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      setStaff([]);
      setFilteredStaff([]);
      toast.error('Error fetching staff data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Check if principal exists
  const principalExists = staff.some(s => s.role === 'Principal');
  const deputyPrincipalsCount = staff.filter(s => s.role === 'Deputy Principal').length;

  // Filtering and pagination
  useEffect(() => {
    let filtered = staff;

    if (searchTerm) {
      filtered = filtered.filter(staffMember =>
        staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staffMember.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staffMember.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(staffMember => staffMember.department === selectedDepartment);
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(staffMember => staffMember.role === selectedRole);
    }

    setFilteredStaff(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, selectedRole, staff]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // CRUD Operations
  const handleCreate = () => {
    setFormData({
      name: '',
      role: 'Teacher',
      position: '',
      department: 'Sciences',
      email: '',
      phone: '',
      image: male, // Default to male avatar
      bio: '',
      responsibilities: [],
      expertise: [],
      achievements: [],
      status: 'active'
    });
    setImageFile(null);
    setImagePreview(male); // Default preview to male avatar
    setNewResponsibility('');
    setNewExpertise('');
    setNewAchievement('');
    setEditingStaff(null);
    setShowModal(true);
  };

  const handleEdit = (staffMember) => {
    setFormData({ 
      ...staffMember,
      responsibilities: Array.isArray(staffMember.responsibilities) ? staffMember.responsibilities : [],
      expertise: Array.isArray(staffMember.expertise) ? staffMember.expertise : [],
      achievements: Array.isArray(staffMember.achievements) ? staffMember.achievements : []
    });
    setImagePreview(staffMember.image || male); // Default to male avatar if no image
    setImageFile(null);
    setNewResponsibility('');
    setNewExpertise('');
    setNewAchievement('');
    setEditingStaff(staffMember);
    setShowModal(true);
  };

  const handleViewDetails = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowDetailModal(true);
  };

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this staff member?')) {
    try {
      const response = await fetch(`/api/staff/${id}`, { // Include ID in URL
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchStaff(); // Refresh the list
        toast.success('Staff member deleted successfully!');
      } else {
        toast.error(result.error || 'Failed to delete staff member');
      }
    } catch (error) {
      console.error('Error deleting staff member:', error);
      toast.error('Error deleting staff member');
    }
  }
};
  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData({ ...formData, image: '' }); // Clear avatar selection when file is uploaded
    }
  };

  // Array field handlers
  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()]
      }));
      setNewResponsibility('');
    }
  };

  const addExpertise = () => {
    if (newExpertise.trim()) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation for unique roles
  if (formData.role === 'Principal' && principalExists && !editingStaff) {
    toast.error('A Principal already exists. There can only be one Principal.');
    return;
  }

  if (formData.role === 'Deputy Principal' && deputyPrincipalsCount >= 2 && !editingStaff) {
    toast.error('Maximum of two Deputy Principals allowed.');
    return;
  }

  setSaving(true);
  try {
    // Create FormData for file upload
    const submitData = new FormData();
    
    // Append all form data
    submitData.append('name', formData.name);
    submitData.append('role', formData.role);
    submitData.append('position', formData.position);
    submitData.append('department', formData.department);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('bio', formData.bio);
    submitData.append('status', formData.status);
    
    // Append arrays as JSON strings
    submitData.append('responsibilities', JSON.stringify(formData.responsibilities));
    submitData.append('expertise', JSON.stringify(formData.expertise));
    submitData.append('achievements', JSON.stringify(formData.achievements));
    
    // Append image file if selected, otherwise append the avatar URL
    if (imageFile) {
      submitData.append('image', imageFile);
    } else if (formData.image && (formData.image === male || formData.image === female)) {
      // If an avatar is selected, we need to handle this differently
      // For now, we'll skip image upload for avatars since they're already in the app
      console.log('Using default avatar');
    }

    let response;
    if (editingStaff) {
      // Update existing staff - include ID in URL
      response = await fetch(`/api/staff/${editingStaff.id}`, {
        method: 'PUT',
        body: submitData,
      });
    } else {
      // Create new staff
      response = await fetch('/api/staff', {
        method: 'POST',
        body: submitData,
      });
    }

    const result = await response.json();

    if (result.success) {
      await fetchStaff(); // Refresh the list
      setShowModal(false);
      toast.success(`Staff member ${editingStaff ? 'updated' : 'created'} successfully!`);
    } else {
      toast.error(result.error || `Failed to ${editingStaff ? 'update' : 'create'} staff member`);
    }
  } catch (error) {
    console.error('Error saving staff member:', error);
    toast.error('Error saving staff member');
  } finally {
    setSaving(false);
  }
};

  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-gray-700">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStaff.length)} of {filteredStaff.length} staff members
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
                className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            </div>
          ))
        }

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <FiChevronRight className="text-lg" />
        </button>
      </div>
    </div>
  );

  const RoleBadge = ({ role }) => {
    const roleColors = {
      'Principal': 'from-purple-500 to-purple-600',
      'Deputy Principal': 'from-blue-500 to-blue-600',
      'Teacher': 'from-orange-500 to-orange-600',
      'BOM Member': 'from-green-500 to-green-600',
      'Counselor': 'from-pink-500 to-pink-600',
      'Librarian': 'from-indigo-500 to-indigo-600',
      'Support Staff': 'from-gray-500 to-gray-600'
    };

    return (
      <span className={`bg-gradient-to-r ${roleColors[role] || 'from-gray-500 to-gray-600'} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
        {role}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">Loading staff data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Staff & BOM Management
          </h1>
          <p className="text-gray-600 mt-2">Manage teaching staff, administration, and board members</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchStaff}
            className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg"
          >
            <FiRotateCw className="text-lg" />
            Refresh
          </button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 lg:px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-orange-500/25 w-full lg:w-auto justify-center"
          >
            <FiPlus className="text-lg" />
            Add Staff
          </motion.button>
        </div>
      </div>

      {/* Staff Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Staff</p>
              <p className="text-xl lg:text-3xl font-bold mt-2">{staff.length}</p>
            </div>
            <IoPeopleCircle className="text-xl lg:text-2xl text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Teaching Staff</p>
              <p className="text-xl lg:text-3xl font-bold mt-2">
                {staff.filter(s => s.role === 'Teacher').length}
              </p>
            </div>
            <FiBook className="text-xl lg:text-2xl text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Administration</p>
              <p className="text-xl lg:text-3xl font-bold mt-2">
                {staff.filter(s => s.role === 'Principal' || s.role === 'Deputy Principal').length}
              </p>
            </div>
            <FiAward className="text-xl lg:text-2xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">BOM Members</p>
              <p className="text-xl lg:text-3xl font-bold mt-2">
                {staff.filter(s => s.role === 'BOM Member').length}
              </p>
            </div>
            <FiShield className="text-xl lg:text-2xl text-purple-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200/50">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            />
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {currentStaff.map((staffMember) => (
          <motion.div
            key={staffMember.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200/50 text-center group cursor-pointer"
            onClick={() => handleViewDetails(staffMember)}
          >
            <div className="relative inline-block mb-4">
              <img
                src={staffMember.image || male}
                alt={staffMember.name}
                className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl object-cover mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg"
              />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                staffMember.status === 'active' ? 'bg-green-500' :
                staffMember.status === 'on-leave' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`}></div>
            </div>
            
            <h3 className="font-bold text-gray-800 text-base lg:text-lg mb-1 group-hover:text-orange-600 transition-colors">
              {staffMember.name}
            </h3>
            <div className="mb-2">
              <RoleBadge role={staffMember.role} />
            </div>
            <p className="text-gray-600 text-sm mb-3">{staffMember.department}</p>
            
            <div className="space-y-2 mb-4 text-xs">
              <div className="flex items-center justify-center gap-1 text-gray-600">
                <FiBriefcase className="text-orange-500" />
                <span>{staffMember.position}</span>
              </div>
              <div className="text-gray-600 line-clamp-2">
                {staffMember.bio}
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(staffMember);
                }}
                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors"
                title="View Details"
              >
                <FiEye className="text-sm" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(staffMember);
                }}
                className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-colors"
                title="Edit"
              >
                <FiEdit className="text-sm" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(staffMember.id);
                }}
                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                title="Delete"
              >
                <FiTrash2 className="text-sm" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {filteredStaff.length > 0 && (
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200/50">
          <Pagination />
        </div>
      )}

      {filteredStaff.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200/50">
          <FiUser className="text-gray-300 text-4xl mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No staff members found</p>
          <p className="text-gray-400 text-sm mt-2">
            {searchTerm || selectedDepartment !== 'all' || selectedRole !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Add your first staff member to get started'
            }
          </p>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="text-xl text-gray-600" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image Upload */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Profile Image
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={imagePreview || male}
                            alt="Preview"
                            className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            <div className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2">
                              <FiUpload className="text-orange-500" />
                              <span className="text-sm font-semibold text-gray-700">
                                {imageFile ? 'Change Image' : 'Upload Image'}
                              </span>
                            </div>
                          </label>
                          {imageFile && (
                            <p className="text-xs text-gray-500 mt-1">
                              Selected: {imageFile.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Avatar Selection */}
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Or select a default avatar:</p>
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(male);
                              setFormData({ ...formData, image: male });
                            }}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                              formData.image === male
                                ? 'border-orange-500 bg-orange-50' 
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                          >
                            <img
                              src={male}
                              alt="Male Avatar"
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                            <span className="text-xs font-medium text-gray-700">Male Avatar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(female);
                              setFormData({ ...formData, image: female });
                            }}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                              formData.image === female
                                ? 'border-orange-500 bg-orange-50' 
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                          >
                            <img
                              src={female}
                              alt="Female Avatar"
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                            <span className="text-xs font-medium text-gray-700">Female Avatar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role *
                    </label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {roles.map(role => (
                        <option 
                          key={role} 
                          value={role}
                          disabled={
                            (role === 'Principal' && principalExists && !editingStaff) ||
                            (role === 'Deputy Principal' && deputyPrincipalsCount >= 2 && !editingStaff)
                          }
                        >
                          {role}
                          {(role === 'Principal' && principalExists && !editingStaff) && ' (Already exists)'}
                          {(role === 'Deputy Principal' && deputyPrincipalsCount >= 2 && !editingStaff) && ' (Max reached)'}
                        </option>
                      ))}
                    </select>
                    <div className="mt-1 text-xs text-gray-500">
                      {formData.role === 'Principal' && principalExists && !editingStaff && (
                        <span className="text-red-500">A Principal already exists</span>
                      )}
                      {formData.role === 'Deputy Principal' && deputyPrincipalsCount >= 2 && !editingStaff && (
                        <span className="text-red-500">Maximum of 2 Deputy Principals allowed</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Mathematics Teacher"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="staff@katwanyaa.ac.ke"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+254 XXX XXX XXX"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Brief biography about the staff member"
                    />
                  </div>

                  {/* Responsibilities */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Responsibilities
                    </label>
                    <div className="space-y-2">
                      {formData.responsibilities.map((resp, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                            {resp}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem('responsibilities', index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiX className="text-sm" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newResponsibility}
                          onChange={(e) => setNewResponsibility(e.target.value)}
                          placeholder="Enter responsibility"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
                        />
                        <button
                          type="button"
                          onClick={addResponsibility}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-1"
                        >
                          <FiPlus className="text-sm" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expertise */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expertise
                    </label>
                    <div className="space-y-2">
                      {formData.expertise.map((exp, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                            {exp}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem('expertise', index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiX className="text-sm" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newExpertise}
                          onChange={(e) => setNewExpertise(e.target.value)}
                          placeholder="Enter expertise"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                        />
                        <button
                          type="button"
                          onClick={addExpertise}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-1"
                        >
                          <FiPlus className="text-sm" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Achievements
                    </label>
                    <div className="space-y-2">
                      {formData.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                            {achievement}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem('achievements', index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiX className="text-sm" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newAchievement}
                          onChange={(e) => setNewAchievement(e.target.value)}
                          placeholder="Enter achievement"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                        />
                        <button
                          type="button"
                          onClick={addAchievement}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-1"
                        >
                          <FiPlus className="text-sm" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.status === 'active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">Active Staff Member</span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        {editingStaff ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingStaff ? 'Update Staff Member' : 'Add Staff Member'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Staff Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedStaff && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Staff Details</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="text-xl text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                  <div className="flex-shrink-0">
                    <img
                      src={selectedStaff.image || male}
                      alt={selectedStaff.name}
                      className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover shadow-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedStaff.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <RoleBadge role={selectedStaff.role} />
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedStaff.status === 'active' ? 'bg-green-100 text-green-800' :
                        selectedStaff.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedStaff.status || 'active'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">{selectedStaff.position}</p>
                    <p className="text-gray-600">{selectedStaff.department} Department</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FiMail className="text-orange-500" />
                        Contact Information
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Email:</span> {selectedStaff.email}</p>
                        <p><span className="font-medium">Phone:</span> {selectedStaff.phone}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <IoSchoolOutline className="text-orange-500" />
                        Professional Details
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Position:</span> {selectedStaff.position}</p>
                        <p><span className="font-medium">Department:</span> {selectedStaff.department}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedStaff.expertise && selectedStaff.expertise.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <FiStar className="text-orange-500" />
                          Expertise
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedStaff.expertise.map((exp, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedStaff.achievements && selectedStaff.achievements.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <FiAward className="text-orange-500" />
                          Achievements
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {selectedStaff.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Bio</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedStaff.bio}</p>
                </div>

                {selectedStaff.responsibilities && selectedStaff.responsibilities.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Key Responsibilities</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {selectedStaff.responsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleEdit(selectedStaff);
                    }}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Edit Staff
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}