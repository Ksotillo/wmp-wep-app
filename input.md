<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Dashboard</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dannymichel/proxima-nova@4.5.2/index.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@typehaus/metropolis@12.0.0-next.7/+esm">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: "Proxima Nova", sans-serif;
            }

            body {
                background-color: #f7f9fc;
                color: #333;
            }

            .navbar {
                display: flex;
                justify-content: space-between; 
                align-items: center;
                padding: 13px 30px;
                background-color: white;
                border-bottom: 2px solid #e0e4e87a;
            }

            .nav-left {
                display: flex;
                align-items: center;
                gap: 30px; 
            }

            .logo-container {
                display: flex;
                align-items: center;
                gap: 15px;
                position: relative;
                padding-right: 32px;
            }

            .logo-container::after {
                content: '';
                position: absolute;
                right: 0px;
                top: -15px;
                height: 155%;
                width: 2px;
                background-color: #e0e4e87a;
            }

            .logo-icon {
                width: 55px;
                height: 55px;
                border-radius: 5px;
                flex-shrink: 0;
            }

            .logo-text {
                font-size: 26px;
                font-weight: 700;
                color: #1a202c;
                font-family: "Metropolis", sans-serif;
            }

            .nav-links {
                display: flex;
                gap: 25px;
            }

            .nav-links a {
                text-decoration: none;
                color: #718096;
                font-size: 14px;
                padding: 8px 20px;
                border-radius: 6px;
                transition: background-color 0.2s ease, color 0.2s ease;
            }

            .nav-links a:hover {
                color: #2d3748;
                background-color: #edf2f7;
            }

            .nav-links a.active {
                background-color: #f0f4f8;
                color: #2d3748;
                font-weight: 600;
            }

            .profile-section {
                display: flex;
                align-items: center;
                gap: 24px;
            }

            .search-bar {
                display: flex;
                align-items: center;
                background-color: #f7f9fc;
                padding: 8px 12px;
                border-radius: 8px;
                
            }

            
            #search-results-dropdown {
                 top: calc(100% + 5px); 
                 left: 0;
                 right: auto; 
                 width: 100%; 
                 min-width: unset; 
            }

            .search-bar i {
                color: #a0aec0;
                margin-right: 8px;
            }

            .search-bar input {
                border: none;
                outline: none;
                background: transparent;
                font-size: 14px;
                color: #4a5568;
            }

            .notification-icon {
                position: relative; 
            }

            .notification-icon i {
                font-size: 20px;
                color: #718096;
                cursor: pointer;
            }

            
            .notification-dot {
                position: absolute;
                top: -3px;  
                right: -3px; 
                width: 8px;
                height: 8px;
                background-color: #e53e3e; 
                border-radius: 50%;
                border: 1px solid white; 
            }

            .profile {
                display: flex;
                align-items: center;
                gap: 18px;
            }

            .profile-pic {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-color: #ece6fc; 
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                color: #a593dd; 
            }

            .profile-info {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                line-height: 1.3;
                margin-right: 16px;
            }

            .profile-info span:first-child {
                font-weight: 600;
                font-size: 14px;
                color: #2d3748;
                font-family: "Metropolis", sans-serif;
            }

            .profile-info span:last-child {
                font-size: 12px;
                color: #a0aec0;
            }

            
            .separator {
                width: 1px;
                height: 24px; 
                background-color: #e0e4e87a; 
                margin: 0 5px; 
            }

            .sub-navbar {
                padding: 4px 30px;
                background-color: white;
                border-bottom: 1px solid #e0e4e8;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .sub-nav-links {
                display: flex;
                gap: 12px;
            }

            .sub-nav-links a {
                padding: 8px 15px;
                text-decoration: none;
                color: #718096;
                font-size: 14px;
                border-radius: 6px;
                transition: background-color 0.2s ease, color 0.2s ease;
                border: 1px solid transparent;
            }

            .sub-nav-links a:hover {
                color: #2d3748;
                background-color: #f7f9fc;
            }

            .sub-nav-links a.active {
                
                background-color: #f0f4f8;
                color: #2d3748;
                font-weight: 600;
            }

            .new-product-btn {
                background-color: #1a1e1f; 
                color: white;
                padding: 8px 16px 8px 12px;
                border: none;
                border-radius: 8px; 
                cursor: pointer;
                font-size: 12px; 
                font-weight: 500;
                display: inline-flex; 
                align-items: center;
                gap: 8px; 
            }

            
            .plus-icon-bg {
                display: inline-flex; 
                padding: 4px;
                border-radius: 4px; 
                margin-right: 4px; 
                line-height: 1; 
                border: 1px solid #e0e4e87d;
            }

            .new-product-btn i {
                font-size: 10px; 
                color: white; 
            }

            .main-container {
                padding: 30px;
            }

            .header-section {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
            }

            .greeting h1 {
                font-size: 24px;
                font-weight: 600;
                color: #2d3748;
                margin-bottom: 4px;
                font-family: "Metropolis", sans-serif;
            }

            .greeting p {
                font-size: 14px;
                color: #abb4ba; 
            }

            .stats-grid {
                grid-column: 1 / -1; 
                display: contents; 
                margin-bottom: 12px;
            }

            .stat-card {
                background: white;
                padding: 20px; 
                border-radius: 12px;
                border: 1px solid #e0e4e87d;
                display: flex;
                flex-direction: column; 
                gap: 4px; 
            }

            
            .stat-top-row {
                display: flex;
                align-items: flex-start; 
                gap: 15px; 
                width: 100%;
            }

            
            .stat-details {
                display: flex;
                flex-direction: column;
                flex-grow: 1; 
                gap: 4px; 
            }

            .stat-icon {
                 font-size: 18px;
                 color: #1a202c; 
                 border: 2px solid #f0f4f8;
                 padding: 8px;
                 border-radius: 8px;
                 flex-shrink: 0;
            }

            .percentage {
                font-size: 12px;
                font-weight: 600;
                padding: 4px 10px;
                border-radius: 12px;
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }

            .percentage i {
                font-size: 10px;
            }

            .positive {
                background: #e6f7f0;
                color: #38a169;
            }

            .negative {
                background: #fff5f5;
                color: #e53e3e;
            }

            .stat-card h3 {
                color: #1a202c; 
                font-size: 14px;
                font-weight: 600;
                margin: 0;
                font-family: "Metropolis", sans-serif;
                 line-height: 1.2; 
            }

            .stat-value {
                font-size: 28px;
                font-weight: 700;
                color: #1a202c; 
                margin: 0;
                line-height: 1.1;
                margin-top: 4px;
            }

            .stat-change {
                font-size: 13px;
                color: #93a0ab;
                font-weight: 600;
                margin-top: 4px;
            }

            .analytics-section {
                grid-column: 1 / -1; 
                display: contents; 
                margin-bottom: 12px;
            }

            .card {
                background: white;
                padding: 25px;
                border-radius: 12px;
                border: 1px solid #e0e4e87d;
            }

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }

            .card-header h3 {
                font-size: 18px;
                font-weight: 600;
                color: #2d3748;
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: "Metropolis", sans-serif;
            }

            .card-header h3 i {
                font-size: 14px;
                color: #a0aec0;
                cursor: pointer;
            }

            
            .time-filters {
                display: inline-flex; 
                border: 1px solid #e0e4e8; 
                border-radius: 8px; 
                overflow: hidden; 
            }

            .time-filters a {
                font-size: 13px;
                color: #718096;
                text-decoration: none;
                
                padding: 6px 12px; 
                
                border-right: 1px solid #e0e4e8; 
                background-color: white; 
                transition: background-color 0.2s ease, color 0.2s ease;
            }

            .time-filters a:last-child {
                border-right: none; 
            }

             .time-filters a.active {
                
                
                color: #1a202c; 
                font-weight: 600; 
             }
             .time-filters a:hover:not(.active) {
                 background-color: #f7f9fc; 
             }

             
            .analytics-body {
                display: grid;
                grid-template-columns: auto 1fr; 
                gap: 30px; 
                align-items: flex-start; 
            }

            .analytics-kpis {
                display: flex;
                flex-direction: column;
                gap: 25px; 
                padding-top: 10px; 
            }

            .kpi-item {
                position: relative;
                padding-left: 15px; 
                display: flex;
                flex-direction: column;
                gap: 4px; 
            }

            .kpi-item::before {
                content: '';
                position: absolute;
                left: 0;
                top: 2px; 
                bottom: 2px; 
                width: 3px;
                background-color: #d0d5dd; 
                border-radius: 2px;
            }

            .kpi-item.kpi-earnings::before {
                background-color: #7f56d9; 
            }

            .kpi-item .kpi-label {
                font-size: 13px;
                color: #718096;
            }

            .kpi-item .kpi-value {
                font-size: 24px; 
                font-weight: 600;
                color: #1a202c;
                line-height: 1.2;
            }

            .kpi-item .kpi-value .percentage {
                 margin-left: 8px;
                 vertical-align: middle; 
            }

            .chart-container {
                height: 250px;
            }

            .impressions .card-header h3 {
                margin-bottom: 0;
            }

            .impressions-total {
                font-size: 13px;
                color: #718096;
                margin-bottom: 20px;
                position: relative;
                padding-left: 15px;
            }

            
            .impressions-total::before {
                content: '';
                position: absolute;
                left: 0;
                top: 2px;
                bottom: 2px;
                width: 3px;
                background-color: #d0d5dd;
                border-radius: 2px;
            }

            .impressions-total span {
                font-size: 24px;
                font-weight: 600;
                color: #2d3748;
                display: block;
                margin-top: 4px;
            }

            .country-item {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 12px;
                margin-bottom: 18px;
                font-size: 14px;
            }

            .country-details {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                gap: 5px;
            }

            .country-top-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }

            .country-item img {
                width: 24px;
                height: 24px;
                object-fit: cover;
                border-radius: 100%;
                flex-shrink: 0;
            }

            .country-top-row span:first-child {
                color: #4a5568;
                font-weight: 500;
            }

            .country-value {
                font-size: 13px;
                color: #718096;
                text-align: right;
            }

            .progress-bar {
                height: 6px;
                background: #edf2f7;
                border-radius: 3px;
                overflow: hidden;
                width: 100%;
            }

            .progress-fill {
                height: 100%;
                background: #718096;
                border-radius: 3px;
            }

            .bottom-section {
                grid-column: 1 / -1; 
                display: contents; 
            }

            .projects-table table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }

            .projects-table th,
            .projects-table td {
                padding: 12px 15px;
                text-align: left;
                border-bottom: 1px solid #edf2f7;
                vertical-align: middle;
                white-space: nowrap;
            }

            .projects-table th {
                color: #a0aec0;
                font-weight: 500;
                text-transform: uppercase;
                font-size: 11px;
                background-color: #f8fafb;
                border-bottom: 1px solid #f0f4f8;
                border-top: 1px solid #f0f4f8;
                padding: 12px 15px;
                vertical-align: middle;
                white-space: nowrap;
            }

            
            .projects-table th:first-child {
                border-top-left-radius: 8px;
            }
            .projects-table th:last-child {
                border-top-right-radius: 8px;
            }

            .projects-table td {
                color: #718096; 
                 
                vertical-align: middle; 
            }

            .projects-table th i,
            .projects-table td i {
                color: #cbd5e0;
                font-size: 10px;
            }

            .projects-table th i {
                margin-left: 5px;
            }

            .projects-table input[type="checkbox"] {
                 
                 accent-color: #cbd5e0; 
            }

            .project-name {
                
                
                
            }

            .project-icon {
                width: 30px;
                height: 30px;
                border-radius: 6px;
                display: inline-flex; 
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: white;
                margin-right: 10px; 
                vertical-align: middle; 
            }
            .icon-blue {
                background-color: #4299e1;
            }
            .icon-green {
                background-color: #48bb78;
            }
            .icon-purple {
                background-color: #9f7aea;
            }
            .icon-red {
                background-color: #f56565;
            }

            .project-name span {
                font-weight: 600; 
                color: #4a5568; 
            }

            .status-active {
                
                
                
                white-space: nowrap; 
            }
            .status-active i {
                color: #38a169!important; 
                font-size: 14px;
                margin-right: 5px; 
                vertical-align: middle; 
             }
             
            .status-active span {
                color: #718096; 
                 
                 vertical-align: middle; 
            }

            .more-options i {
                color: #a0aec0;
                cursor: pointer;
                font-size: 16px;
            }

            
            .payments .chart-container {
                
                height: 280px; 
            }

            
            .dashboard-layout {
                display: grid;
                grid-template-columns: repeat(4, 1fr); 
                gap: 20px; 
                width: 100%;
            }

            
            .analytics.card {
                grid-column: 1 / 4; 
            }
            .impressions.card {
                grid-column: 4 / 5; 
            }
            .projects-table.card {
                 grid-column: 1 / 4; 
            }
            .payments.card {
                 grid-column: 4 / 5; 
            }

            
            .dropdown-container {
                position: relative;
            }

            .dropdown-menu {
                display: none; 
                position: absolute;
                top: calc(100% + 10px); 
                right: 0;
                background-color: white;
                min-width: 200px; 
                border: 1px solid #e0e4e8;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                z-index: 1000; 
                overflow: hidden; 
            }

            .dropdown-menu.show {
                display: block; 
            }

            .dropdown-item {
                display: block;
                padding: 10px 15px;
                color: #4a5568;
                text-decoration: none;
                font-size: 14px;
                white-space: nowrap;
            }

            .dropdown-item:hover {
                background-color: #f7f9fc;
            }

            .dropdown-divider {
                height: 1px;
                margin: 5px 0;
                overflow: hidden;
                background-color: #e0e4e8;
            }
        </style>
    </head>
    <body>
        <nav class="navbar">
            <!-- Group logo and nav links -->
            <div class="nav-left">
                <div class="logo-container">
                     <svg
                        class="logo-icon"
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        width="100%"
                        viewBox="0 0 640 432"
                        enable-background="new 0 0 640 432"
                        xml:space="preserve"
                    >
                        <path
                            fill="#F9FBFC"
                            opacity="1.000000"
                            stroke="none"
                            d="
M471.000000,433.000000 
	C314.036469,433.000000 157.572952,433.000000 1.054709,433.000000 
	C1.054709,289.070038 1.054709,145.140076 1.054709,1.105049 
	C214.213531,1.105049 427.427155,1.105049 640.820374,1.105049 
	C640.820374,144.999817 640.820374,288.999878 640.820374,433.000000 
	C584.473328,433.000000 527.986694,433.000000 471.000000,433.000000 
M420.172211,251.918243 
	C420.172211,303.669403 420.172211,355.420563 420.172211,407.431427 
	C421.943176,407.554565 423.236786,407.745758 424.525818,407.718842 
	C440.889618,407.377014 456.993164,405.259918 472.610504,400.212585 
	C510.318939,388.025635 541.301514,366.406677 564.616028,334.169800 
	C586.623108,303.740631 598.159790,269.567993 598.567871,232.167999 
	C599.203857,173.875549 598.834900,115.572121 598.876221,57.273338 
	C598.877441,55.543633 598.704407,53.813801 598.540283,50.721325 
	C596.135193,52.929287 594.671692,54.176044 593.316345,55.530994 
	C536.888428,111.940170 480.469330,168.358139 424.057709,224.783569 
	C423.003296,225.838257 422.051880,226.995911 420.602753,228.102768 
	C420.602753,228.102768 420.153534,228.121979 420.052948,227.174240 
	C420.052948,168.666016 420.052948,110.157784 420.052948,50.396755 
	C417.185608,52.962471 415.335358,54.558292 413.550781,56.224445 
	C400.058167,68.821571 386.614380,81.471268 373.087799,94.031769 
	C334.327545,130.023727 295.556152,166.003769 256.740753,201.936264 
	C247.244492,210.727203 237.563080,219.318130 227.846924,227.147324 
	C227.846924,168.441040 227.846924,109.734764 227.846924,51.097374 
	C167.615204,51.097374 108.762306,51.097374 49.134357,51.097374 
	C49.134357,70.894897 49.077988,90.200615 49.146263,109.505882 
	C49.282310,147.974030 49.807011,186.443939 49.565224,224.909302 
	C49.359234,257.679871 56.964241,288.268494 74.230606,316.037354 
	C82.237137,328.913940 92.107735,340.631470 101.336304,353.149841 
	C103.210823,351.393768 104.068916,350.632355 104.880081,349.823853 
	C134.368759,320.432678 163.813232,290.997040 193.358002,261.662384 
	C204.793198,250.308548 216.454102,239.182053 228.086594,228.893143 
	C228.086594,288.167542 228.086594,347.441925 228.086594,408.099457 
	C240.465347,407.011383 252.320892,406.879333 263.823669,404.797882 
	C309.204926,396.586212 347.944489,375.776917 378.166595,340.706207 
	C401.787292,313.295990 415.668518,281.255859 419.734985,245.678848 
	C419.911163,247.447220 420.087341,249.215591 420.172211,251.918243 
z"
                        />
                        <path
                            fill="#F9CB4B"
                            opacity="1.000000"
                            stroke="none"
                            d="
M419.347748,245.042557 
	C415.668518,281.255859 401.787292,313.295990 378.166595,340.706207 
	C347.944489,375.776917 309.204926,396.586212 263.823669,404.797882 
	C252.320892,406.879333 240.465347,407.011383 228.086594,408.099457 
	C228.086594,347.441925 228.086594,288.167542 228.050873,228.446930 
	C228.015167,228.000702 227.966766,228.000992 227.966766,228.001007 
	C237.563080,219.318130 247.244492,210.727203 256.740753,201.936264 
	C295.556152,166.003769 334.327545,130.023727 373.087799,94.031769 
	C386.614380,81.471268 400.058167,68.821571 413.550781,56.224445 
	C415.335358,54.558292 417.185608,52.962471 420.052948,50.396755 
	C420.052948,110.157784 420.052948,168.666016 420.049377,228.095551 
	C419.813110,234.358765 419.580444,239.700653 419.347748,245.042557 
z"
                        />
                        <path
                            fill="#12B0F0"
                            opacity="1.000000"
                            stroke="none"
                            d="
M228.013672,227.976334 
	C216.454102,239.182053 204.793198,250.308548 193.358002,261.662384 
	C163.813232,290.997040 134.368759,320.432678 104.880081,349.823853 
	C104.068916,350.632355 103.210823,351.393768 101.336304,353.149841 
	C92.107735,340.631470 82.237137,328.913940 74.230606,316.037354 
	C56.964241,288.268494 49.359234,257.679871 49.565224,224.909302 
	C49.807011,186.443939 49.282310,147.974030 49.146263,109.505882 
	C49.077988,90.200615 49.134357,70.894897 49.134357,51.097374 
	C108.762306,51.097374 167.615204,51.097374 227.846924,51.097374 
	C227.846924,109.734764 227.846924,168.441040 227.906845,227.574158 
	C227.966766,228.000992 228.015167,228.000702 228.013672,227.976334 
z"
                        />
                        <path
                            fill="#F57791"
                            opacity="1.000000"
                            stroke="none"
                            d="
M421.052399,228.105515 
	C422.051880,226.995911 423.003296,225.838257 424.057709,224.783569 
	C480.469330,168.358139 536.888428,111.940170 593.316345,55.530994 
	C594.671692,54.176044 596.135193,52.929287 598.540283,50.721325 
	C598.704407,53.813801 598.877441,55.543633 598.876221,57.273338 
	C598.834900,115.572121 599.203857,173.875549 598.567871,232.167999 
	C598.159790,269.567993 586.623108,303.740631 564.616028,334.169800 
	C541.301514,366.406677 510.318939,388.025635 472.610504,400.212585 
	C456.993164,405.259918 440.889618,407.377014 424.525818,407.718842 
	C423.236786,407.745758 421.943176,407.554565 420.172211,407.431427 
	C420.172211,355.420563 420.172211,303.669403 420.451782,251.119675 
	C420.838379,242.915909 420.945404,235.510712 421.052399,228.105515 
z"
                        />
                        <path
                            fill="#F899B0"
                            opacity="1.000000"
                            stroke="none"
                            d="
M420.827576,228.104141 
	C420.945404,235.510712 420.838379,242.915909 420.497437,250.652527 
	C420.087341,249.215591 419.911163,247.447220 419.541382,245.360703 
	C419.580444,239.700653 419.813110,234.358765 420.099670,228.569427 
	C420.153534,228.121979 420.602753,228.102768 420.827576,228.104141 
z"
                    />
                </svg>
                <div class="logo-text">WunderUI</div>
            </div>
            <div class="nav-links">
                <a href="#" class="active">Home</a>
                <a href="#">Overview</a>
                <a href="#">Projects</a>
                <a href="#">Tasks</a>
                <a href="#">Reports</a>
                <a href="#">Statements</a>
            </div>
        </div>

        <!-- Profile section remains on the right -->
        <div class="profile-section">
             <!-- Notification Dropdown -->
            <div class="dropdown-container notification-dropdown-container">
                <div class="notification-icon" style="cursor: pointer;" data-dropdown-toggle="notification-dropdown">
                    <i class="far fa-bell"></i>
                    <span class="notification-dot"></span>
                </div>
                <div class="dropdown-menu notification-dropdown" id="notification-dropdown">
                    <div style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #eee;">Notifications</div>
                    <a href="#" class="dropdown-item" style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-shopping-cart" style="color: #3498db;"></i>
                        <div>
                            New order received (#12345)
                            <div style="font-size: 11px; color: #a0aec0;">5 minutes ago</div>
                        </div>
                    </a>
                     <a href="#" class="dropdown-item" style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-chart-line" style="color: #e53e3e;"></i>
                        <div>
                            Traffic dropped by 15%
                            <div style="font-size: 11px; color: #a0aec0;">1 hour ago</div>
                        </div>
                    </a>
                    <a href="#" class="dropdown-item" style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-user-plus" style="color: #38a169;"></i>
                         <div>
                            New customer registered (customer@example.com)
                            <div style="font-size: 11px; color: #a0aec0;">3 hours ago</div>
                        </div>
                    </a>
                     <a href="#" class="dropdown-item" style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-comment-dots" style="color: #f6ad55;"></i>
                         <div>
                            Comment on 'Creative Brandbook'
                            <div style="font-size: 11px; color: #a0aec0;">Yesterday</div>
                        </div>
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item" style="text-align: center; color: #718096;">View All Notifications</a>
                </div>
            </div>

             <div class="separator"></div>

             <!-- Profile Dropdown -->
             <div class="dropdown-container profile-dropdown-container">
                 <div class="profile" style="cursor: pointer;" data-dropdown-toggle="profile-dropdown">
                    <div class="profile-pic">JM</div>
                    <div class="profile-info">
                        <span>Jonah Miller</span>
                        <span>Administrator</span>
                    </div>
                    <div class="stacked-chevrons" style="display: flex; flex-direction: column; align-items: center; line-height: 0.7;">
                       <i class="fas fa-chevron-up" style="font-size: 8px; color: #a0aec0;"></i>
                       <i class="fas fa-chevron-down" style="font-size: 8px; color: #a0aec0;"></i>
                    </div>
                 </div>
                 <div class="dropdown-menu profile-dropdown" id="profile-dropdown">
                    <a href="#" class="dropdown-item"><i class="far fa-user-circle" style="margin-right: 8px; color: #a0aec0;"></i>View Profile</a>
                    <a href="#" class="dropdown-item"><i class="far fa-credit-card" style="margin-right: 8px; color: #a0aec0;"></i>Billing</a>
                    <a href="#" class="dropdown-item"><i class="fas fa-life-ring" style="margin-right: 8px; color: #a0aec0;"></i>Help Center</a>
                    <a href="#" class="dropdown-item"><i class="fas fa-cog" style="margin-right: 8px; color: #a0aec0;"></i>Account Settings</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item"><i class="fas fa-sign-out-alt" style="margin-right: 8px; color: #a0aec0;"></i>Logout</a>
                 </div>
             </div>
        </div>
    </nav>

    <div class="sub-navbar">
        <div class="sub-nav-links">
            <a href="#" class="active">Dashboard</a>
            <a href="#">Sales</a>
            <a href="#">Performance</a>
            <a href="#">Traffic</a>
            <a href="#">Audience</a>
            <a href="#">Marketing Tools</a>
        </div>
         <!-- Wrap search bar in dropdown container -->
         <div class="dropdown-container search-dropdown-container">
            <div class="search-bar">
                 <i class="fas fa-search"></i>
                 <!-- Add ID to input for easier selection -->
                 <input type="text" placeholder="Search" id="search-input" />
            </div>
            <!-- Search results dropdown -->
            <div class="dropdown-menu search-results-dropdown" id="search-results-dropdown">
                <!-- Results will be populated by JS -->
                <div class="dropdown-item" style="color: #a0aec0; text-align: center;">Start typing to search...</div>
            </div>
        </div>
    </div>

    <div class="main-container">
        <div class="header-section">
            <div class="greeting">
                <h1>Hello, Jonah Miller</h1>
                <p>It's great to see you again.</p>
            </div>
            <button class="new-product-btn">
                <span class="plus-icon-bg">
                    <i class="fas fa-plus"></i>
                </span>
                New Product
            </button>
        </div>

        <!-- New Parent Grid Wrapper -->
        <div class="dashboard-layout">

            <!-- Stats Grid (now just holds cards for parent grid) -->
            <div class="stats-grid">
                 <!-- Card 1: Total Profits -->
                <div class="stat-card">
                    <div class="stat-top-row">
                        <i class="fas fa-wallet stat-icon"></i>
                        <div class="stat-details">
                            <h3>Total Profits</h3>
                            <div class="stat-value">$68,510.32</div>
                            <span class="stat-change">$52,012.34 last year</span>
                        </div>
                        <span class="percentage positive"><i class="fas fa-arrow-up"></i>+18.2%</span>
                    </div>
                </div>

                <!-- Card 2: New Customers -->
                <div class="stat-card">
                    <div class="stat-top-row">
                        <i class="fas fa-users stat-icon"></i>
                        <div class="stat-details">
                            <h3>New Customers</h3>
                            <div class="stat-value">153,640</div>
                            <span class="stat-change">120,145 last year</span>
                        </div>
                        <span class="percentage positive"><i class="fas fa-arrow-up"></i>+13.5%</span>
                    </div>
                </div>

                 <!-- Card 3: Total Orders -->
                <div class="stat-card">
                    <div class="stat-top-row">
                        <i class="fas fa-box-open stat-icon"></i>
                        <div class="stat-details">
                             <h3>Total Orders</h3>
                             <div class="stat-value">181,960</div>
                             <span class="stat-change">151,423 last year</span>
                        </div>
                        <span class="percentage positive"><i class="fas fa-arrow-up"></i>+12.7%</span>
                    </div>
                </div>

                 <!-- Card 4: Total Traffic -->
                <div class="stat-card">
                     <div class="stat-top-row">
                        <i class="fas fa-chart-line stat-icon"></i>
                         <div class="stat-details">
                            <h3>Total Traffic</h3>
                            <div class="stat-value">1,563,029</div>
                            <span class="stat-change">2,420,301 last year</span>
                         </div>
                        <span class="percentage negative"><i class="fas fa-arrow-down"></i>-9.7%</span>
                     </div>
                </div>
            </div>

            <!-- Analytics Section (now just holds cards for parent grid) -->
            <div class="analytics-section">
                <div class="analytics card">
                    <div class="card-header">
                        <h3>Analytics <i class="fas fa-info-circle"></i></h3>
                         <div class="time-filters">
                            <a href="#" class="active">12 months</a>
                            <a href="#">30 days</a>
                            <a href="#">7 days</a>
                            <a href="#">24 hours</a>
                        </div>
                    </div>
                    <div class="analytics-body">
                        <div class="analytics-kpis">
                            <div class="kpi-item kpi-earnings">
                                <span class="kpi-label">Total Earnings</span>
                                <span class="kpi-value">$56,423.32</span>
                            </div>
                             <div class="kpi-item">
                                <span class="kpi-label">Total Views</span>
                                <span class="kpi-value">1,256,014</span>
                            </div>
                             <div class="kpi-item">
                                <span class="kpi-label">Conversation Rate</span>
                                <span class="kpi-value">
                                    10.4%
                                    <span class="percentage positive" style="font-size: 11px; padding: 3px 8px"><i class="fas fa-arrow-up"></i>+6.2%</span>
                                </span>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="analyticsChart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="impressions card">
                    <div class="card-header">
                        <h3>Impressions</h3>
                    </div>
                     <div class="impressions-total">
                        Total
                        <span>159,367</span>
                    </div>
                    <div class="country-item">
                        <img src="https://flagcdn.com/w40/us.png" alt="US Flag" />
                        <div class="country-details">
                            <div class="country-top-row">
                                <span>United States</span>
                                <span class="country-value">142,410</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 89.3%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="country-item">
                        <img src="https://flagcdn.com/w40/de.png" alt="DE Flag" />
                        <div class="country-details">
                            <div class="country-top-row">
                                <span>Germany</span>
                                <span class="country-value">175,133</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 75.2%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="country-item">
                        <img src="https://flagcdn.com/w40/it.png" alt="IT Flag" />
                        <div class="country-details">
                            <div class="country-top-row">
                                <span>Italy</span>
                                <span class="country-value">58,173</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 36.5%"></div>
                            </div>
                        </div>
                    </div>
                     <div class="country-item">
                        <img src="https://flagcdn.com/w40/gb-eng.png" alt="EN Flag" />
                        <div class="country-details">
                            <div class="country-top-row">
                                <span>England</span>
                                <span class="country-value">138,110</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 86.7%"></div>
                            </div>
                        </div>
                     </div>
                     <div class="country-item">
                        <img src="https://flagcdn.com/w40/gb.png" alt="UK Flag" />
                        <div class="country-details">
                            <div class="country-top-row">
                                <span>United Kingdom</span>
                                <span class="country-value">182,503</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 70%"></div>
                            </div>
                        </div>
                     </div>
                </div>
            </div>

            <!-- Bottom Section (now just holds cards for parent grid) -->
            <div class="bottom-section">
                 <div class="projects-table card">
                     <div class="card-header" style="margin-bottom: 0px">
                         <!-- <h3>Projects</h3> -->
                     </div>
                     <table>
                         <thead>
                             <tr>
                                 <th><input type="checkbox" /></th>
                                 <th>No.<i class="fas fa-sort"></i></th>
                                 <th>Name<i class="fas fa-sort"></i></th>
                                 <th>Status<i class="fas fa-sort"></i></th>
                                 <th>Views<i class="fas fa-sort"></i></th>
                                 <th>Sales<i class="fas fa-sort"></i></th>
                                 <th>Conversion<i class="fas fa-sort"></i></th>
                                 <th>Total<i class="fas fa-sort"></i></th>
                                 <th>More</th>
                             </tr>
                         </thead>
                         <tbody>
                             <tr>
                                 <td><input type="checkbox" checked /></td>
                                 <td>01</td>
                                 <td class="project-name">
                                     <div class="project-icon icon-blue"><i class="far fa-gem"></i></div>
                                     <span>Basic design guideline</span>
                                 </td>
                                 <td class="status-active">
                                     <i class="fas fa-check-circle"></i> 
                                     <span>9 Jan 2023 9:43 PM</span>
                                 </td>
                                 <td>3,147</td>
                                 <td>1,004</td>
                                 <td>6.5%</td>
                                 <td>$14,238</td>
                                 <td class="more-options"><i class="fas fa-ellipsis-v"></i></td>
                             </tr>
                             <tr>
                                 <td><input type="checkbox" /></td>
                                 <td>02</td>
                                 <td class="project-name">
                                     <div class="project-icon icon-green"><i class="fas fa-book"></i></div>
                                     <span>Creative Brandbook</span>
                                 </td>
                                 <td class="status-active">
                                     <i class="fas fa-check-circle"></i> 
                                     <span>9 Jan 2023 9:43 PM</span>
                                 </td>
                                 <td>3,147</td>
                                 <td>1,004</td>
                                 <td>6.5%</td>
                                 <td>$14,238</td>
                                 <td class="more-options"><i class="fas fa-ellipsis-v"></i></td>
                             </tr>
                             <tr>
                                 <td><input type="checkbox" /></td>
                                 <td>03</td>
                                 <td class="project-name">
                                     <div class="project-icon icon-purple"><i class="fas fa-layer-group"></i></div>
                                     <span>Landing Page Templates</span>
                                 </td>
                                 <td class="status-active">
                                     <i class="fas fa-check-circle"></i> 
                                     <span>9 Jan 2023 9:43 PM</span>
                                 </td>
                                 <td>3,147</td>
                                 <td>1,004</td>
                                 <td>6.5%</td>
                                 <td>$14,238</td>
                                 <td class="more-options"><i class="fas fa-ellipsis-v"></i></td>
                             </tr>
                             <tr>
                                 <td><input type="checkbox" /></td>
                                 <td>04</td>
                                 <td class="project-name">
                                     <div class="project-icon icon-red"><i class="fas fa-tools"></i></div>
                                     <span>UI Software Tool</span>
                                 </td>
                                 <td class="status-active">
                                     <i class="fas fa-check-circle"></i> 
                                     <span>9 Jan 2023 9:43 PM</span>
                                 </td>
                                 <td>3,147</td>
                                 <td>1,004</td>
                                 <td>6.5%</td>
                                 <td>$14,238</td>
                                 <td class="more-options"><i class="fas fa-ellipsis-v"></i></td>
                             </tr>
                             <tr>
                                 <td><input type="checkbox" checked /></td>
                                 <td>05</td>
                                 <td class="project-name">
                                     <div class="project-icon icon-blue"><i class="far fa-gem"></i></div>
                                     <span>Basic design guideline</span>
                                 </td>
                                 <td class="status-active">
                                     <i class="fas fa-check-circle"></i> 
                                     <span>9 Jan 2023 9:43 PM</span>
                                 </td>
                                 <td>3,147</td>
                                 <td>1,004</td>
                                 <td>6.5%</td>
                                 <td>$14,238</td>
                                 <td class="more-options"><i class="fas fa-ellipsis-v"></i></td>
                             </tr>
                             <tr>
                                 <td><input type="checkbox" /></td>
                                 <td>06</td>
                                 <td class="project-name">
                                     <div class="project-icon icon-green"><i class="fas fa-book"></i></div>
                                     <span>Creative Brandbook</span>
                                 </td>
                                 <td class="status-active">
                                     <i class="fas fa-check-circle"></i> 
                                     <span>9 Jan 2023 9:43 PM</span>
                                 </td>
                                 <td>3,147</td>
                                 <td>1,004</td>
                                 <td>6.5%</td>
                                 <td>$14,238</td>
                                 <td class="more-options"><i class="fas fa-ellipsis-v"></i></td>
                             </tr>
                         </tbody>
                     </table>
                 </div>
                 <div class="payments card">
                     <div class="card-header">
                        <h3>Payments</h3>
                        <span class="percentage positive"><i class="fas fa-arrow-up"></i>+12.7%</span>
                    </div>
                    <div class="chart-container">
                        <canvas id="paymentsChart"></canvas>
                    </div>
                </div>
            </div>
        </div> <!-- End Dashboard Layout Wrapper -->
    </div>

    <script>
        function getChartContext(id) {
            const canvas = document.getElementById(id);
            if (!canvas) {
                console.error(`Canvas element with id "${id}" not found.`);
                return null;
            }
            return canvas.getContext("2d");
        }

        const analyticsCtx = getChartContext("analyticsChart");
        if (analyticsCtx) {
            let analyticsChartInstance = Chart.getChart(analyticsCtx.canvas);
            if (analyticsChartInstance) {
                analyticsChartInstance.destroy();
            }

            // Function to generate labels and random data based on timeframe
            function generateChartData(timeframe) {
                let labels = [];
                let dataPrevious = [];
                let dataCurrent = [];
                let count = 0;

                switch (timeframe) {
                    case '30d':
                        count = 30;
                        labels = Array.from({ length: count }, (_, i) => `Day ${i + 1}`);
                        break;
                    case '7d':
                        count = 7;
                        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                        break;
                    case '24h':
                        count = 24;
                        labels = Array.from({ length: count }, (_, i) => `${i}:00`);
                        break;
                    case '12m':
                    default:
                        count = 18;
                        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        for (let i = 0; i < count; i++) {
                            const year = 23 + Math.floor(i / 12);
                            labels.push(`${monthNames[i % 12]} '${year}`);
                        }
                        break;
                }

                // Generate independent random data
                for (let i = 0; i < count; i++) {
                    const prev = Math.floor(Math.random() * 25000) + 10000;
                    const curr = Math.floor(Math.random() * 30000) + 5000;
                    dataPrevious.push(prev);
                    dataCurrent.push(curr);
                }
                // Return original structure
                return { labels, dataPrevious, dataCurrent };
            }

            // Function to update chart with new data
            function updateAnalyticsChart(timeframe) {
                if (!analyticsChartInstance) return;

                const { labels, dataPrevious, dataCurrent } = generateChartData(timeframe);

                analyticsChartInstance.data.labels = labels;
                analyticsChartInstance.data.datasets[0].data = dataCurrent;
                analyticsChartInstance.data.datasets[1].data = dataPrevious;
                analyticsChartInstance.update();
            }

            if (analyticsChartInstance) {
                analyticsChartInstance.destroy();
            }

            const initialData = generateChartData('12m');

            analyticsChartInstance = new Chart(analyticsCtx, {
                type: "bar",
                data: {
                    labels: initialData.labels,
                    datasets: [
                        {
                            label: 'Current',
                            data: initialData.dataCurrent,
                            backgroundColor: '#4a90e2',
                            borderColor: '#4a90e2',
                            borderRadius: 4,
                            borderSkipped: false,
                            barPercentage: 0.6,
                            categoryPercentage: 0.7,
                        },
                        {
                            label: 'Previous',
                            data: initialData.dataPrevious,
                            backgroundColor: '#e2e8f0',
                            borderColor: '#e2e8f0',
                            borderRadius: 4,
                            borderSkipped: false,
                            barPercentage: 0.6,
                            categoryPercentage: 0.7,
                        }
                    ]
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: {
                         legend: {
                            display: false
                         },
                         tooltip: {}
                    },
                    scales: {
                        y: {
                            stacked: true,
                            beginAtZero: true,
                            grid: {
                                drawBorder: false,
                                color: "#edf2f7"
                            },
                            ticks: {
                                color: "#a0aec0",
                                stepSize: 10000,
                                callback: function (value) {
                                    if (value >= 1000) {
                                        return (value / 1000) + 'k';
                                    }
                                    return value;
                                }
                            }
                        },
                        x: {
                            stacked: true,
                             grid: {
                                display: false
                            },
                             ticks: {
                                color: "#a0aec0"
                            }
                        }
                    }
                }
            });
        }

        const paymentsCtx = getChartContext("paymentsChart");
        if (paymentsCtx) {
            let paymentsChartInstance = Chart.getChart(paymentsCtx.canvas);
            if (paymentsChartInstance) {
                paymentsChartInstance.destroy();
            }

            new Chart(paymentsCtx, {
                type: "line",
                data: {
                    labels: ["Jan", "Feb", "Mar", "Apr"],
                    datasets: [
                        {
                            label: "Payments",
                            data: [0, 15000, 25000, 40000],
                            borderColor: "#68d391",
                            backgroundColor: "rgba(104, 211, 145, 0.1)",
                            fill: true,
                            tension: 0.4,
                        },
                    ],
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                drawBorder: false,
                                color: "#edf2f7",
                            },
                            ticks: {
                                color: "#a0aec0",
                                stepSize: 10000,
                                callback: function (value) {
                                    return value / 1000 + "k";
                                },
                            },
                        },
                        x: {
                            grid: {
                                display: false,
                            },
                            ticks: {
                                color: "#a0aec0",
                            },
                        },
                    },
                },
            });
        }

        // Dropdown Toggle Logic & Placeholder Alerts
        const searchableSections = [
            'Dashboard', 'Sales', 'Performance', 'Traffic', 'Audience', 'Marketing Tools',
            'Analytics', 'Impressions', 'Projects', 'Payments', 'Profile', 'Settings', 'Billing'
        ];
        const searchInput = document.getElementById('search-input');
        const searchResultsDropdown = document.getElementById('search-results-dropdown');

        document.body.addEventListener('click', function(event) {
            const target = event.target;
            const isDropdownToggle = target.closest('[data-dropdown-toggle]');
            const activeDropdowns = document.querySelectorAll('.dropdown-menu.show');
            const link = target.closest('a');
            const isSearchClick = target.closest('.search-dropdown-container');

            // Close open dropdowns (excluding search dropdown if clicking inside search area)
            activeDropdowns.forEach(dropdown => {
                 // Close if clicking outside the dropdown's container AND outside the search area (if it's the search dropdown)
                const clickedOutsideDropdown = !target.closest('.dropdown-container') || target.closest('.dropdown-container') !== dropdown.closest('.dropdown-container');
                const isSearchDropdown = dropdown.id === 'search-results-dropdown';
                
                if (clickedOutsideDropdown || (isSearchDropdown && !isSearchClick)) {
                     if (!isDropdownToggle || dropdown.id !== isDropdownToggle.dataset.dropdownToggle) {
                        dropdown.classList.remove('show');
                    }
                }
            });

            // Handle Notification/Profile dropdown toggle click
            if (isDropdownToggle) {
                const dropdownId = isDropdownToggle.dataset.dropdownToggle;
                const dropdown = document.getElementById(dropdownId);
                if (dropdown) {
                    dropdown.classList.toggle('show');
                    // Ensure search dropdown doesn't interfere if opening profile/notifications
                    if (dropdownId !== 'search-results-dropdown' && searchResultsDropdown) {
                        searchResultsDropdown.classList.remove('show');
                    }
                }
            }
            else if (link) {
                const isNavLink = link.closest('.nav-links');
                const isSubNavLink = link.closest('.sub-nav-links');
                const isDropdownItem = link.classList.contains('dropdown-item');
                const isSearchResult = link.classList.contains('search-result');

                if (((isNavLink || isSubNavLink) && !link.classList.contains('active')) || isDropdownItem || isSearchResult) {
                    event.preventDefault();
                    const sectionName = link.textContent || link.innerText;
                    alert('Section: ' + sectionName.trim());

                    // Close relevant dropdown after clicking an item
                    const parentDropdown = link.closest('.dropdown-menu');
                    if(parentDropdown) {
                        parentDropdown.classList.remove('show');
                    }
                }
            }
        });

        // Search input functionality
        if (searchInput && searchResultsDropdown) {
            searchInput.addEventListener('input', function(event) {
                const searchTerm = event.target.value.toLowerCase().trim();
                searchResultsDropdown.innerHTML = '';

                if (searchTerm.length > 0) {
                    const matches = searchableSections.filter(section => section.toLowerCase().includes(searchTerm));

                    if (matches.length > 0) {
                        matches.forEach(match => {
                            const item = document.createElement('a');
                            item.href = '#';
                            item.classList.add('dropdown-item', 'search-result');
                            item.textContent = match;
                            searchResultsDropdown.appendChild(item);
                        });
                        searchResultsDropdown.classList.add('show');
                    } else {
                        const noResult = document.createElement('div');
                        noResult.classList.add('dropdown-item');
                        noResult.textContent = 'No sections found';
                        noResult.style.color = '#a0aec0';
                        searchResultsDropdown.appendChild(noResult);
                         searchResultsDropdown.classList.add('show');
                    
                    }
                } else {
                    searchResultsDropdown.classList.remove('show');
                }
            });

             // Keep search dropdown open when input has focus
            searchInput.addEventListener('focus', function() {
                 if (searchInput.value.trim().length > 0 && searchResultsDropdown.children.length > 0 && !searchResultsDropdown.querySelector('.dropdown-item[style*="color: #a0aec0"]')) {
                    searchResultsDropdown.classList.add('show');
                 }
            });
        }

    </script>
</body>
</html>
