const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const XRay = require('../models/XRay');
const Report = require('../models/Report');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', async (req, res) => {
    try {
        // Get counts
        const totalPatients = await Patient.countDocuments();
        const totalXrays = await XRay.countDocuments();
        const totalReports = await Report.countDocuments();
        const processedXrays = await XRay.countDocuments({ processed: true });

        // Get recent activity
        const recentPatients = await Patient.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name age gender createdAt');

        const recentXrays = await XRay.find()
            .sort({ uploadDate: -1 })
            .limit(5)
            .populate('patientId', 'name')
            .select('imageType uploadDate processed');

        // Get lesion type distribution
        const reports = await Report.find();
        const lesionTypes = {};

        reports.forEach(report => {
            report.findings.forEach(finding => {
                lesionTypes[finding.lesionType] = (lesionTypes[finding.lesionType] || 0) + 1;
            });
        });

        const lesionDistribution = Object.keys(lesionTypes).map(type => ({
            type,
            count: lesionTypes[type]
        }));

        // Get monthly X-ray uploads (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyUploads = await XRay.aggregate([
            {
                $match: {
                    uploadDate: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$uploadDate' },
                        month: { $month: '$uploadDate' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        res.json({
            success: true,
            stats: {
                totalPatients,
                totalXrays,
                totalReports,
                processedXrays,
                processingRate: totalXrays > 0 ? ((processedXrays / totalXrays) * 100).toFixed(2) : 0
            },
            recentActivity: {
                patients: recentPatients,
                xrays: recentXrays
            },
            analytics: {
                lesionDistribution,
                monthlyUploads
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
});

// @route   GET /api/dashboard/trends
// @desc    Get detection trends
// @access  Private
router.get('/trends', async (req, res) => {
    try {
        const { period = '30' } = req.query; // days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        const reports = await Report.find({
            createdAt: { $gte: startDate }
        }).populate('patientId', 'age gender');

        // Analyze trends
        const trends = {
            totalDetections: 0,
            averageConfidence: 0,
            severityDistribution: { Mild: 0, Moderate: 0, Severe: 0 },
            ageGroups: { '0-18': 0, '19-35': 0, '36-50': 0, '51+': 0 },
            genderDistribution: { Male: 0, Female: 0, Other: 0 }
        };

        let totalConfidence = 0;
        let confidenceCount = 0;

        reports.forEach(report => {
            report.findings.forEach(finding => {
                trends.totalDetections++;

                if (finding.confidence) {
                    totalConfidence += finding.confidence;
                    confidenceCount++;
                }

                if (finding.severity) {
                    trends.severityDistribution[finding.severity]++;
                }
            });

            // Age group analysis
            if (report.patientId && report.patientId.age) {
                const age = report.patientId.age;
                if (age <= 18) trends.ageGroups['0-18']++;
                else if (age <= 35) trends.ageGroups['19-35']++;
                else if (age <= 50) trends.ageGroups['36-50']++;
                else trends.ageGroups['51+']++;
            }

            // Gender distribution
            if (report.patientId && report.patientId.gender) {
                trends.genderDistribution[report.patientId.gender]++;
            }
        });

        trends.averageConfidence = confidenceCount > 0
            ? (totalConfidence / confidenceCount).toFixed(2)
            : 0;

        res.json({
            success: true,
            period: `${period} days`,
            trends
        });
    } catch (error) {
        console.error('Get trends error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching trends',
            error: error.message
        });
    }
});

module.exports = router;
