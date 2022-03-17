
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("myForm");
  
  // boton para abrir el modal
  const btnAdd = document.getElementById("btnAdd");
  
  // boton de Guardar que esta dentro del modal
  const btnModalSave = document.getElementById("btnModalSave");

  // el cuerpo de la tabla
  const skillList = document.getElementById("skillList");
  
  // la fila seleccionada actual, sirve cuando se va a editar o eliminar una fila de la tabla
  var rowCurrent = null;

  // Instancia del Modal
  const modalElem = document.getElementById("exampleModal");
  const modal = new bootstrap.Modal(modalElem);

  // Formulario de envio
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    let dataJson = {};
    formData.forEach((value, key) => {
      dataJson = { 
        ...dataJson, 
        ...{ [key]: value },
        skills: getSkills()
      };
    });
    
    console.log(dataJson);
  });

  // Funciones
  /* 
    función para recolectar todos los datos de las skills, se ejecuta cuando
    le da clic al boton de guardar (global), cuando se envia el JSON
  */
  const getSkills = () => {
    var skills = [];
    for (const iterator of skillList.children) {
      skills.push({
        name: iterator.querySelector(".name").textContent,
        dateFrom: iterator.querySelector(".dateFrom").textContent,
        description: iterator.querySelector(".description").textContent
      });
    }
    return skills;
  }

  // retorna un objeto con todos los inputs del formulario skills
  const getInputsSkills = () => {
    const name = document.querySelector("input[id=name]");
    const dateFrom = document.querySelector("input[id=dateFrom]");
    const description = document.querySelector("input[id=description]");
    return { name, dateFrom, description };
  }

  // Función que agregar un nuevo item(fila) a la tabla
  const addRowListener = (e) => {
    const { name, dateFrom, description } = getInputsSkills();

    // Se clona una fila de la tabla con valores dinamicos
    const trTemplate = document.getElementById("trTemplate");
    const clone = trTemplate.content.cloneNode(true);
    clone.querySelector(".name").textContent = name.value;
    clone.querySelector(".dateFrom").textContent = dateFrom.value;
    clone.querySelector(".description").textContent = description.value;
    
    // Se agregar el elemento clone a la tabla
    skillList.appendChild(clone);

    // Se cierra el modal
    modal.hide();
  }

  // Función que actualiza los valores de una fila de la tabla
  const editRowListener = (e) => { 
    const { name, dateFrom, description } = getInputsSkills();
    if (rowCurrent != null) {
      // Se actualiza los nuevos valores editados en la tabla
      rowCurrent.querySelector(".name").textContent = name.value;
      rowCurrent.querySelector(".dateFrom").textContent = dateFrom.value;
      rowCurrent.querySelector(".description").textContent = description.value;

      // Se cierra el modal
      modal.hide();
    }
  }
  
  // Función que detecta que acción se debe ejecuta (agregar ó editar)
  const btnModalSaveListener = (e) => {
    // atributo que debe estar en el boton HTML (data-action)
    const btnAction = btnModalSave.getAttribute("data-action");
    if (btnAction === "add") {
      addRowListener(e);
    } else if (btnAction === "edit") {
      editRowListener(e);
    }
  }

  // Función que cambia la acción del boton que hay en el modal (Guardar)
  const btnAddListener = (e) => {
    btnModalSave.setAttribute("data-action", "add");
  }

  /* 
    Función que permite encontrar el padre de un elemento, 
    especificando el nombre de la etiqueta del padre (multiniveles)
  */
  const parentNodeElement = (node, tagName) => {
    let parent = node.target.parentNode;
    while (parent.tagName != tagName) {
      parent = parent.parentNode;
    }
    return parent;
  }

  // Modifica los valores de los inputs al presionar el boton de editar de una fila
  const fillInputsValueRow = (e) => {
    const name = rowCurrent.querySelector(".name");
    const dateFrom = rowCurrent.querySelector(".dateFrom");
    const description = rowCurrent.querySelector(".description");

    e.target.querySelector("input[id=name]").value = name.textContent;
    e.target.querySelector("input[id=dateFrom]").value = dateFrom.textContent;
    e.target.querySelector("input[id=description]").value = description.textContent;
  }

  // Función que detecta las acciones de modificar y eliminar
  const btnActionGroup = (e) => {
    const elemClassList = e.target.classList;
    rowCurrent = parentNodeElement(e, "TR");
    if (elemClassList.contains("fa-pencil") || elemClassList.contains("editRow")) {
      // abre el modal
      modal.show();

      // modifica los valores de los inputs
      modalElem.addEventListener("shown.bs.modal", fillInputsValueRow);

      // cambia la acción del boton a editar
      btnModalSave.setAttribute("data-action", "edit");
    } else if (elemClassList.contains("fa-trash") || elemClassList.contains("deleteRow")) {
      // elimina una fila
      rowCurrent.remove();
    }
  }

  // DOM
  btnAdd.addEventListener("click", btnAddListener);
  btnModalSave.addEventListener("click", btnModalSaveListener);
  skillList.addEventListener("click", btnActionGroup);


  // TABS
  const changeTabsContents = (action) => {
    // obtener elemento activo
    let elemActiveKey;
    let elemCurrent;
    listTabs.forEach((element, key) => {
      if (element.classList.contains("active")) {
        elemActiveKey = key;
      }
    });
    
    // cambiar la información
    listTabs[elemActiveKey].classList.remove("active");
    listTabsContent[elemActiveKey].classList.remove("active", "show");
    if (action === "next") {
      elemCurrent = elemActiveKey + 1;
      listTabs[elemCurrent].classList.add("active");
      listTabsContent[elemCurrent].classList.add("active", "show");
    } else if (action === "prev") {
      elemCurrent = elemActiveKey - 1;
      listTabs[elemCurrent].classList.add("active");
      listTabsContent[elemCurrent].classList.add("active", "show");
    }

    // verificar si esta en el ultimo o primer elemento
    if (elemCurrent <= 0) {
      buttonPreviousTab.classList.add("disabled");
    } else {
      buttonPreviousTab.classList.remove("disabled");
    }

    if (elemCurrent >= (listTabs.length - 1)) {
      buttonNextTab.classList.add("disabled");
    } else {
      buttonNextTab.classList.remove("disabled");
    }
  }

  const buttonNextTab = document.getElementById("nextTab");
  const buttonPreviousTab = document.getElementById("previousTab");
  const listTabs = document.querySelectorAll("button[data-bs-toggle=tab]");
  const listTabsContent = document.querySelectorAll("div.tab-content>div.tab-pane");
  
  buttonNextTab.addEventListener("click", () => changeTabsContents("next"));
  buttonPreviousTab.addEventListener("click", () => changeTabsContents("prev"));
});