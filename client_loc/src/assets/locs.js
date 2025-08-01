// Campus Locations - Updated with accurate coordinates
export const locations = [
    // Basic locations for backward compatibility
    {
        name: 'ICT Building',
        lat: 6.126698976719969,
        lng: 8.143381733833069,
    },
    {
        name: 'AE-FUNAI Female Hostel',
        lat: 6.128525844301733,
        lng: 8.145583953719655,
    },
    {
        name: 'Theater Art Auditorium',
        lat: 6.135108672026378,
        lng: 8.144373553286792,
    },
]

// Comprehensive Campus Locations
export const campusLocations = {
    // Gates and Entry Points
    gates: [
        {
            name: 'Front Gate',
            lat: 6.1378266,
            lng: 8.1459486,
            category: 'gate'
        },
        {
            name: 'Back Gate',
            lat: 6.132435,
            lng: 8.140433,
            category: 'gate'
        }
    ],

    // Administrative Buildings
    administrative: [
        {
            name: 'Security Officer Building',
            lat: 6.137497,
            lng: 8.145524,
            category: 'administrative'
        },
        {
            name: 'SUG Office',
            lat: 6.132918,
            lng: 8.140519,
            category: 'administrative'
        },
        {
            name: 'Works Department',
            lat: 6.133191,
            lng: 8.141284,
            category: 'administrative'
        }
    ],

    // Transportation
    transport: [
        {
            name: 'Funai Park (Bus)',
            lat: 6.137149,
            lng: 8.145532,
            category: 'transport'
        },
        {
            name: 'Funai Park (Shuttle)',
            lat: 6.137131,
            lng: 8.145387,
            category: 'transport'
        }
    ],

    // Religious Centers
    religious: [
        {
            name: 'Holy Family Chaplaincy, AE-FUNAI',
            lat: 6.137353964150157,
            lng: 8.144483511178525,
            category: 'religious'
        }
    ],

    // Academic Buildings - Science & Technology
    academic_science: [
        {
            name: 'AE-FUNAI Physics Lab',
            lat: 6.133818,
            lng: 8.141920,
            category: 'academic'
        },
        {
            name: 'AE-FUNAI Chemistry Lab',
            lat: 6.133896,
            lng: 8.141865,
            category: 'academic'
        },
        {
            name: 'AE-FUNAI Biology Laboratory',
            lat: 6.134012,
            lng: 8.141812,
            category: 'academic'
        },
        {
            name: 'Animal House',
            lat: 6.134026,
            lng: 8.141768,
            category: 'academic'
        },
        {
            name: 'Department of Biology',
            lat: 6.127354,
            lng: 8.142937,
            category: 'academic'
        },
        {
            name: 'Department of Computer Science/Maths & Statistics',
            lat: 6.125396,
            lng: 8.142920,
            category: 'academic'
        },
        {
            name: 'Physical Science Audit',
            lat: 6.125558,
            lng: 8.142620,
            category: 'academic'
        }
    ],

    // Academic Buildings - Arts & Social Sciences
    academic_arts: [
        {
            name: 'Theater Art Auditorium',
            lat: 6.135108672026378,
            lng: 8.144373553286792,
            category: 'academic'
        },
        {
            name: 'Fine and Applied Art Studio',
            lat: 6.133271,
            lng: 8.140869,
            category: 'academic'
        },
        {
            name: 'Department of Fine and Applied Arts',
            lat: 6.133452,
            lng: 8.143002,
            category: 'academic'
        },
        {
            name: 'Music Department',
            lat: 6.132906,
            lng: 8.140496,
            category: 'academic'
        },
        {
            name: 'Department of Mass Communication',
            lat: 6.132973,
            lng: 8.140923,
            category: 'academic'
        },
        {
            name: 'Department of Psychology',
            lat: 6.133471,
            lng: 8.141609,
            category: 'academic'
        },
        {
            name: 'Department of Criminology & Political Science/Environmental Sciences',
            lat: 6.133380,
            lng: 8.141407,
            category: 'academic'
        },
        {
            name: 'Department of Economics/Sociology',
            lat: 6.132963,
            lng: 8.142048,
            category: 'academic'
        }
    ],

    // Management & Business
    academic_management: [
        {
            name: 'Faculty of Management Sciences',
            lat: 6.132162,
            lng: 8.140257,
            category: 'academic'
        }
    ],

    // Cultural Centers
    cultural: [
        {
            name: 'Olaudah Equiano Igbo Center',
            lat: 6.134701,
            lng: 8.143127,
            category: 'cultural'
        },
        {
            name: 'Igbo Center Iruka',
            lat: 6.134653,
            lng: 8.14820,
            category: 'cultural'
        }
    ],

    // Educational Support
    educational_support: [
        {
            name: 'SIWES Building',
            lat: 6.133552,
            lng: 8.141688,
            category: 'educational'
        },
        {
            name: 'CBT Center',
            lat: 6.133791,
            lng: 8.141835,
            category: 'educational'
        },
        {
            name: 'Book Shop',
            lat: 6.133101,
            lng: 8.142301,
            category: 'educational'
        }
    ],

    // Auditoriums & Event Centers
    venues: [
        {
            name: 'University Auditorium',
            lat: 6.132478,
            lng: 8.140801,
            category: 'venue'
        }
    ],

    // Academic Blocks
    academic_blocks: [
        {
            name: 'A Block',
            lat: 6.133601,
            lng: 8.143317,
            category: 'academic'
        },
        {
            name: 'C Block',
            lat: 6.133221,
            lng: 8.142492,
            category: 'academic'
        },
        {
            name: 'Prof Eni Njoku Block (Parents Forum)',
            lat: 6.127455,
            lng: 8.143527,
            category: 'academic'
        }
    ],

    // Sports & Recreation
    recreation: [
        {
            name: 'Football Field',
            lat: 6.133069,
            lng: 8.142809,
            category: 'recreation'
        },
        {
            name: 'Volleyball Court',
            lat: 6.132576,
            lng: 8.141558,
            category: 'recreation'
        }
    ],

    // Medical Facilities
    medical: [
        {
            name: 'X-ray Clinic',
            lat: 6.128693,
            lng: 8.148842,
            category: 'medical'
        },
        {
            name: 'Hon. Chike Okafor Medical Centre',
            lat: 6.128281,
            lng: 8.149163,
            category: 'medical'
        }
    ],

    // Student Housing
    housing: [
        {
            name: 'Hostel C',
            lat: 6.128943,
            lng: 8.143880,
            category: 'housing'
        },
        {
            name: 'AE-FUNAI Female Hostel',
            lat: 6.128525844301733,
            lng: 8.145583953719655,
            category: 'housing'
        }
    ],

    // Commercial & Services
    commercial: [
        {
            name: 'Nice Cool Garden Beverages and Snacks',
            lat: 6.133917,
            lng: 8.142180,
            category: 'commercial'
        },
        {
            name: 'Funai Outlook Limited',
            lat: 6.132979,
            lng: 8.140675,
            category: 'commercial'
        },
        {
            name: 'Tastia Restaurant and Bakery (Vegas)',
            lat: 6.128612,
            lng: 8.143088,
            category: 'commercial'
        },
        {
            name: 'Zenith Bank plc',
            lat: 6.134440338343271,
            lng: 8.142534048441526,
            category: 'commercial'
        }
    ],

    // Other Buildings
    other: [
        {
            name: 'Former RC',
            lat: 6.135006,
            lng: 8.143516,
            category: 'other'
        },
        {
            name: 'Texas Lodge',
            lat: 6.135483,
            lng: 8.143822,
            category: 'other'
        },
        {
            name: 'ICT Building',
            lat: 6.126698976719969,
            lng: 8.143381733833069,
            category: 'other'
        }
    ]
}