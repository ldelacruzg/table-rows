
document.addEventListener("DOMContentLoaded", (e) => {
  const form = document.getElementById("myForm");
  const btnAddSkill = document.getElementById("btnAddSkill");
  var skill = { skill: [] };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    let dataJson = {};
    formData.forEach((value, key) => {
      dataJson = { 
        ...dataJson, 
        ...{ [key]: value },
        ...skill
      };
    });
  
    console.log(dataJson);
  });

  btnAddSkill.addEventListener("click", () => {
    const skillList = document.getElementById("skillList");
    const name = document.querySelector("input[id=name]");
    const dateFrom = document.querySelector("input[id=dateFrom]");
    const description = document.querySelector("input[id=description]");
    
    const trTemplate = document.getElementById("trTemplate");
    const clone = trTemplate.content.cloneNode(true);
    clone.querySelector(".name").textContent = name.value;
    clone.querySelector(".dateFrom").textContent = dateFrom.value;
    clone.querySelector(".description").textContent = description.value;
    clone.querySelector(".editRow").addEventListener("click", (e) => {
      console.log();
      const elem = e.target.parentNode.parentNode;
      elem.querySelector(".name").innerHTML = `
          <input type="text" value="${name.value}" class="form-control" />
      `;

      elem.querySelector(".dateFrom").innerHTML = `
        <input type="date" class="form-control" value="${dateFrom.value}" />
      `;

      elem.querySelector(".description").innerHTML = `
        <input type="text" value="${description.value}" class="form-control" />
      `;
    });


    skill.skill.push({
      name: name.value,
      dateFrom: dateFrom.value,
      description: description.value
    });

    skillList.appendChild(clone);
  });
});


