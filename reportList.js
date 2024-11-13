document.addEventListener('DOMContentLoaded', function () {
    var tabContent = document.getElementById("tabContent");

    var htmlContent = `
        <style>
            /* Estilos de tabla */
            .table {
                width: 100%;
                margin-top: 20px;
            }
            .expand-btn {
                background: none;
                border: none;
                color: #000000;
                cursor: pointer;
                padding: 0;
                font-size: 1.5rem;
            }
            .expand-btn:hover {
                color: #0056b3;
            }
            .expand-btn i {
                vertical-align: middle;
            }
            /* Estilo para los títulos de las pestañas en negro */
            .nav-link {
                color: #000 !important;
            }
            .nav-link:hover {
                color: #0056b3 !important;
            }
            /* Aseguramos que las flechas de ordenamiento estén a la derecha con margen */
            th .order-icon {
                float: right; /* Posiciona el ícono a la derecha */
                margin-right: 10px; /* Margen de 10px desde el borde derecho de la celda */
            }
        </style>

        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="delegate-reports-list-tab" data-bs-toggle="tab" data-bs-target="#delegate-reports-list" type="button" role="tab" aria-controls="delegate-reports-list" aria-selected="true">Delegate Reports List</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="delegate-summary-report-tab" data-bs-toggle="tab" data-bs-target="#delegate-summary-report" type="button" role="tab" aria-controls="delegate-summary-report" aria-selected="false">Delegate Summary Report</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="committee-reports-list-tab" data-bs-toggle="tab" data-bs-target="#committee-reports-list" type="button" role="tab" aria-controls="committee-reports-list" aria-selected="false">Committee Reports List</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="delegate-reports-detailed-tab" data-bs-toggle="tab" data-bs-target="#delegate-reports-detailed" type="button" role="tab" aria-controls="delegate-reports-detailed" aria-selected="false">Delegate Reports Detailed</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="committee-reports-detailed-tab" data-bs-toggle="tab" data-bs-target="#committee-reports-detailed" type="button" role="tab" aria-controls="committee-reports-detailed" aria-selected="false">Committee Reports Detailed</button>
            </li>
        </ul>

        <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="delegate-reports-list" role="tabpanel" aria-labelledby="delegate-reports-list-tab">
                <table id="delegateList" class="table table-striped table-bordered nowrap" style="width:100%">
                    <thead>
                        <tr>
                            <th>Delegate <i class="bi bi-arrow-down-up order-icon"></i></th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <nav aria-label="Page navigation example">
                    <ul class="pagination justify-content-center"></ul>
                </nav>
            </div>

            <div class="tab-pane fade" id="delegate-summary-report" role="tabpanel" aria-labelledby="delegate-summary-report-tab">
                <div>Content for Delegate Summary Report</div>
            </div>

            <div class="tab-pane fade" id="committee-reports-list" role="tabpanel" aria-labelledby="committee-reports-list-tab">
                <div>Content for Committee Reports List</div>
            </div>

            <div class="tab-pane fade" id="delegate-reports-detailed" role="tabpanel" aria-labelledby="delegate-reports-detailed-tab">
                <div>Content for Delegate Reports Detailed</div>
            </div>

            <div class="tab-pane fade" id="committee-reports-detailed" role="tabpanel" aria-labelledby="committee-reports-detailed-tab">
                <div>Content for Committee Reports Detailed</div>
            </div>
        </div>
    `;

    tabContent.innerHTML = htmlContent;

    var script1 = document.createElement('script');
    script1.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    document.body.appendChild(script1);

    script1.onload = function () {
        var script2 = document.createElement('script');
        script2.src = 'https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js';
        document.body.appendChild(script2);

        script2.onload = function () {
            fetch('delegatesData.json')
                .then(response => response.json())
                .then(data => {
                    $(document).ready(function () {
                        var table = $('#delegateList').DataTable({
                            responsive: true,
                            data: data.delegates,
                            columns: [
                                { data: 'delegateName' },
                                {
                                    data: null,
                                    orderable: false,
                                    render: function () {
                                        return '<button class="expand-btn btn btn-link"><i class="bi bi-arrow-down-circle"></i></button>';
                                    }
                                }
                            ],
                            language: {
                                search: "Buscar:",
                                lengthMenu: "Mostrar _MENU_ entradas",
                                info: "Mostrando _START_ a _END_ de _TOTAL_ entradas"
                            },
                            dom: '<"top"f>rt<"bottom"ilp><"clear">',
                            order: [[0, 'asc']]
                        });

                        $('#delegateList').on('click', '.expand-btn', function () {
                            var tr = $(this).closest('tr');
                            var row = table.row(tr);
                        
                            if (row.child.isShown()) {
                                row.child.hide();
                                $(this).html('<i class="bi bi-arrow-down-circle"></i>');
                            } else {
                                row.child(formatRowDetails(row.data(), row.index())).show();
                                $(this).html('<i class="bi bi-arrow-up-circle"></i>');
                        
                                // Inicializa DataTable en la subtabla recién creada con el objeto de `details`
                                $('#subTable_' + row.index()).DataTable({
                                    responsive: true,
                                    searching: false,
                                    paging: false,
                                    info: false,
                                    data: Array.isArray(row.data().details) ? row.data().details : [row.data().details], // Verifica si es un array, si no lo es, lo convierte
                                    columns: [
                                        { data: 'fullName', title: 'Full Name' },
                                        { data: 'ngausMemberId', title: 'NGAUS Member ID Number' },
                                        { data: 'payGrade', title: 'Pay Grade' },
                                        { data: 'rank', title: 'Rank' },
                                        { data: 'branch', title: 'Branch' },
                                        { data: 'dutyStatus', title: 'Duty Status' },
                                        {
                                            data: 'caucuses.warrantOfficerCaucusArmy',
                                            title: 'Warrant Officer Caucus Army',
                                            render: function (data) { 
                                                return data ? '<i class="bi bi-check-circle" style="color: green;"></i>' : '';
                                            }
                                        },
                                        {
                                            data: 'caucuses.areaIIIArmyCaucus',
                                            title: 'Area III Army Caucus',
                                            render: function (data) { 
                                                return data ? '<i class="bi bi-check-circle" style="color: green;"></i>' : '';
                                            }
                                        },
                                        {
                                            data: 'caucuses.retiredAirForce',
                                            title: 'Retired Air Force',
                                            render: function (data) { 
                                                return data ? '<i class="bi bi-check-circle" style="color: green;"></i>' : '';
                                            }
                                        },
                                        {
                                            data: 'caucuses.committeeOnJointResolutions',
                                            title: 'Committee on Joint Resolutions',
                                            render: function (data) { 
                                                return data ? '<i class="bi bi-check-circle" style="color: green;"></i>' : '';
                                            }
                                        },
                                        {
                                            data: 'caucuses.retiredArmy',
                                            title: 'Retired Army',
                                            render: function (data) { 
                                                return data ? '<i class="bi bi-check-circle" style="color: green;"></i>' : '';
                                            }
                                        },
                                        {
                                            data: 'caucuses.areaIIIAirForceCaucus',
                                            title: 'Area III Air Force Caucus',
                                            render: function (data) { 
                                                return data ? '<i class="bi bi-check-circle" style="color: green;"></i>' : '';
                                            }
                                        },
                                        {
                                            data: 'caucuses.committeeOnAirForceResolutions',
                                            title: 'Committee on Air Force Resolutions',
                                            render: function (data) { 
                                                return data ? '<i class="bi bi-check-circle" style="color: green;"></i>' : '';
                                            }
                                        },
                                        {
                                            data: 'caucuses.companyGradeAirForce',
                                            title: 'Company Grade (Air Force)',
                                            render: function (data) { 
                                                return data ? '<i class="bi bi-check-circle" style="color: green;"></i>' : '';
                                            }
                                        },
                                        {
                                            data: 'caucuses.companyGradeArmy',
                                            title: 'Company Grade (Army)',
                                            render: function (data) { 
                                                return data ? '<i class="bi bi-check-circle" style="color: green;"></i>' : '';
                                            }
                                        },
                                        {
                                            data: 'caucuses.committeeOnNominations',
                                            title: 'Committee on Nominations',
                                            render: function (data) { 
                                                return data ? '<i class="bi bi-check-circle" style="color: green;"></i>' : '';
                                            }
                                        },
                                        {
                                            data: 'caucuses.committeeOnArmyResolutions',
                                            title: 'Committee on Army Resolutions',
                                            render: function (data) { 
                                                return data ? '<i class="bi bi-check-circle" style="color: green;"></i>' : '';
                                            }
                                        }
                                    ]
                                });
                            }
                        });

                        function formatRowDetails(data, rowIndex) {
                            var detailsTable = `
                                <div class="table-responsive">
                                    <table id="subTable_${rowIndex}" class="table table-bordered table-striped dataTable no-footer" cellspacing="0" width="100%">
                                        <thead>
                                            <tr>
                                                <th>Full Name</th>
                                                <th>NGAUS Member ID</th>
                                                <th>Pay Grade</th>
                                                <th>Rank</th>
                                                <th>Branch</th>
                                                <th>Duty Status</th>
                                                <th>Warrant Officer Caucus Army</th>
                                                <th>Area III Army Caucus</th>
                                                <th>Retired Air Force</th>
                                                <th>Committee on Joint Resolutions</th>
                                                <th>Retired Army</th>
                                                <th>Area III Air Force Caucus</th>
                                                <th>Committee on Air Force Resolutions</th>
                                                <th>Company Grade (Air Force)</th>
                                                <th>Company Grade (Army)</th>
                                                <th>Committee on Nominations</th>
                                                <th>Committee on Army Resolutions</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            `;
                            return detailsTable;
                        }
                    });
                })
                .catch(error => console.error('Error fetching delegates data:', error));
        }
    };
});
