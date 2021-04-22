$(document).ready(function() {
        const config = {
            apiKey: "AIzaSyD9w-BMC-4WrQppa6VnOCrszo4QMIyROXU",
    authDomain: "euques-teste.firebaseapp.com",
    databaseURL: "https://euques-teste-default-rtdb.firebaseio.com",
    projectId: "euques-teste",
    storageBucket: "euques-teste.appspot.com",
    messagingSenderId: "48182046778",
    appId: "1:48182046778:web:8b44d4fffe7e746488c503",
    measurementId: "G-W32QJCQXRT"
    };    
    firebase.initializeApp(config); //iniciar firebase
    
    var filaEliminada; //para capturara la fila eliminada
    var filaEditada; //para capturara la fila editada o actualizada

    //icones editores   
    const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
    const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';

    var db = firebase.database();
    var coleccionProductos = db.ref().child("productos");
         
    var dataSet = [];//array para guardar os campos do formulário
    var table = $('#tablaProductos').DataTable({
                //traduz o Data Table 
                language: {
                    "sEmptyTable": "Nenhum registro encontrado",
                    "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                    "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
                    "sInfoFiltered": "(Filtrados de _MAX_ registros)",
                    "sInfoThousands": ".",
                    "sLengthMenu": "_MENU_ resultados por página",
                    "sLoadingRecords": "Carregando...",
                    "sProcessing": "Processando...",
                    "sZeroRecords": "Nenhum registro encontrado",
                    "sSearch": "Pesquisar",
                    "oPaginate": {
                        "sNext": "Próximo",
                        "sPrevious": "Anterior",
                        "sFirst": "Primeiro",
                        "sLast": "Último"
                    },
                    "oAria": {
                        "sSortAscending": ": Ordenar colunas de forma ascendente",
                        "sSortDescending": ": Ordenar colunas de forma descendente"
                    },
                    "select": {
                        "rows": {
                            "_": "Selecionado %d linhas",
                            "0": "Nenhuma linha selecionada",
                            "1": "Selecionado 1 linha"
                        }
                    },
                    "buttons": {
                        "copy": "Copiar para a área de transferência",
                        "copyTitle": "Cópia bem sucedida",
                        "copySuccess": {
                            "1": "Uma linha copiada com sucesso",
                            "_": "%d linhas copiadas com sucesso"
                        }
                    }
                },
                pageLength : 5,
                lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
                data: dataSet,
                columnDefs: [
                    {
                        targets: [0], 
                        visible: false, //ocultamos la columna de ID que es la [0]                        
                    },
                    {
                        targets: -1,        
                        defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>"+iconoEditar+"</button><button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Apagar'>"+iconoBorrar+"</button></div></div>"
                    }
                ]
                	   
            });

    coleccionProductos.on("child_added", datos => {        
        dataSet = [datos.key, datos.child("codigo").val(), datos.child("descripcion").val(), datos.child("cantidad").val()];
        table.rows.add([dataSet]).draw();
    });
    coleccionProductos.on('child_changed', datos => {           
        dataSet = [datos.key, datos.child("codigo").val(), datos.child("descripcion").val(), datos.child("cantidad").val()];
        table.row(filaEditada).data(dataSet).draw();
    });
    coleccionProductos.on("child_removed", function() {
        table.row(filaEliminada.parents('tr')).remove().draw();                     
    });
          
    $('form').submit(function(e){                         
        e.preventDefault();
        let id = $.trim($('#id').val());        
        let codigo = $.trim($('#codigo').val());
        let descripcion = $.trim($('#descripcion').val());         
        let cantidad = $.trim($('#cantidad').val());                         
        let idFirebase = id;        
        if (idFirebase == ''){                      
            idFirebase = coleccionProductos.push().key;
        };                
        data = {codigo:codigo, descripcion:descripcion, cantidad:cantidad};             
        actualizacionData = {};
        actualizacionData[`/${idFirebase}`] = data;
        coleccionProductos.update(actualizacionData);
        id = '';        
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('hide');
    });

    //Botões
    $('#btnNuevo').click(function() {
        $('#id').val('');        
        $('#codigo').val('');
        $('#descripcion').val('');         
        $('#cantidad').val('');      
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('show');
    });        

    $("#tablaProductos").on("click", ".btnEditar", function() {    
        filaEditada = table.row($(this).parents('tr'));           
        let fila = $('#tablaProductos').dataTable().fnGetData($(this).closest('tr'));               
        let id = fila[0];
        console.log(id);
		let codigo = $(this).closest('tr').find('td:eq(0)').text(); 
        let descripcion = $(this).closest('tr').find('td:eq(1)').text();        
        let cantidad = parseInt($(this).closest('tr').find('td:eq(2)').text());        
        $('#id').val(id);        
        $('#codigo').val(codigo);
        $('#descripcion').val(descripcion);                
        $('#cantidad').val(cantidad);                
        $('#modalAltaEdicion').modal('show');
	});  
  
    $("#tablaProductos").on("click", ".btnBorrar", function() {   
        filaEliminada = $(this);
        Swal.fire({
        title: 'Deseja excuir esse produto?',
        text: "Essa operação não pode ser desfeita!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Excluir'
        }).then((result) => {
        if (result.value) {
            let fila = $('#tablaProductos').dataTable().fnGetData($(this).closest('tr'));            
            let id = fila[0];            
            db.ref(`productos/${id}`).remove()
            Swal.fire('Excluido!', 'Esse produto foi excluido.','success')
        }
        })        
	});  

});