const YatraRegistration = require('../models/YatraRegistration');

// @desc    Create a new Yatra Registration
// @route   POST /api/yatra-registration
// @access  Public
exports.createRegistration = async (req, res) => {
    try {
        const {
            yatraId,
            yatraTitle,
            primaryEmail,
            primaryPhone,
            members,
            sameRoomPreference,
            accommodationNotes,
            selectedTrain,
            selectedPackages,
            totalAmount,
            suggestions,
            isAdvancePayment,
            advancedPaymentAmount
        } = req.body;

        // Validate required fields
        if (!yatraId || !yatraTitle || !primaryEmail || !primaryPhone) {
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }

        // Parse members if it's a string
        let parsedMembers = members;
        if (typeof members === 'string') {
            try {
                parsedMembers = JSON.parse(members);
            } catch (e) {
                parsedMembers = [];
            }
        }

        // Parse selectedTrain if it's a string
        let parsedTrain = selectedTrain;
        if (typeof selectedTrain === 'string') {
            try {
                parsedTrain = JSON.parse(selectedTrain);
            } catch (e) {
                parsedTrain = null;
            }
        }

        // Parse selectedPackages if it's a string
        let parsedPackages = selectedPackages;
        if (typeof selectedPackages === 'string') {
            try {
                parsedPackages = JSON.parse(selectedPackages);
            } catch (e) {
                parsedPackages = [];
            }
        } else if (!selectedPackages) {
            parsedPackages = [];
        }

        // Handle file uploads - payment screenshot
        let paymentScreenshotUrl = null;
        if (req.files && req.files.paymentScreenshot) {
            paymentScreenshotUrl = req.files.paymentScreenshot[0].path;
        }

        // Handle aadhaar uploads
        if (req.files && req.files.aadhaarCards && parsedMembers) {
            req.files.aadhaarCards.forEach((file, index) => {
                if (parsedMembers[index]) {
                    parsedMembers[index].aadhaarCard = file.path;
                }
            });
        }

        const newRegistration = new YatraRegistration({
            yatraId,
            yatraTitle,
            primaryEmail,
            primaryPhone,
            members: parsedMembers || [],
            sameRoomPreference: sameRoomPreference === 'true' || sameRoomPreference === true,
            accommodationNotes,
            selectedTrain: parsedTrain,
            selectedPackages: parsedPackages,
            paymentScreenshot: paymentScreenshotUrl,
            paymentStatus: paymentScreenshotUrl ? 'uploaded' : 'pending',
            totalAmount: parseFloat(totalAmount) || 0,
            paymentAmount: (isAdvancePayment === 'true' || isAdvancePayment === true) ? (parseFloat(advancedPaymentAmount) || 0) : (parseFloat(totalAmount) || 0),
            paymentType: (isAdvancePayment === 'true' || isAdvancePayment === true) ? 'advance' : 'full',
            suggestions
        });

        const registration = await newRegistration.save();
        res.status(201).json(registration);
    } catch (err) {
        console.error('Error creating yatra registration:', err);
        // Include specific error details for debugging (Mongoose validation errors, etc.)
        res.status(500).json({
            msg: 'Server Error: ' + err.message,
            error: err.name === 'ValidationError' ? Object.values(err.errors).map(e => e.message) : err.message
        });
    }
};

// @desc    Get all Yatra Registrations
// @route   GET /api/yatra-registration
// @access  Private/Admin
exports.getAllRegistrations = async (req, res) => {
    try {
        const registrations = await YatraRegistration.find()
            .populate('yatraId', 'title date locations')
            .sort({ createdAt: -1 });
        res.json(registrations);
    } catch (err) {
        console.error('Error fetching registrations:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Get registrations for a specific Yatra
// @route   GET /api/yatra-registration/yatra/:yatraId
// @access  Private/Admin
exports.getRegistrationsByYatra = async (req, res) => {
    try {
        const registrations = await YatraRegistration.find({ yatraId: req.params.yatraId })
            .sort({ createdAt: -1 });
        res.json(registrations);
    } catch (err) {
        console.error('Error fetching registrations:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Get single registration
// @route   GET /api/yatra-registration/:id
// @access  Private/Admin
exports.getRegistrationById = async (req, res) => {
    try {
        const registration = await YatraRegistration.findById(req.params.id)
            .populate('yatraId', 'title date locations image');

        if (!registration) {
            return res.status(404).json({ msg: 'Registration not found' });
        }
        res.json(registration);
    } catch (err) {
        console.error('Error fetching registration:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Update registration status
// @route   PUT /api/yatra-registration/:id
// @access  Private/Admin
exports.updateRegistration = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        const updateData = {};

        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        const registration = await YatraRegistration.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!registration) {
            return res.status(404).json({ msg: 'Registration not found' });
        }

        res.json(registration);
    } catch (err) {
        console.error('Error updating registration:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Delete a registration
// @route   DELETE /api/yatra-registration/:id
// @access  Private/Admin
exports.deleteRegistration = async (req, res) => {
    try {
        const registration = await YatraRegistration.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({ msg: 'Registration not found' });
        }

        await YatraRegistration.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Registration deleted' });
    } catch (err) {
        console.error('Error deleting registration:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
