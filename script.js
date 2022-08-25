// global variable
var USER_NAME;
var USER_TYPE;
var SITE;
var IS_LOG_IN;
var DATA;
var TICKET = {};
const URL =
  "https://script.google.com/macros/s/AKfycbyz1Q-T7oiY0OD12HFVNFisFaPfwfz7wwL-7b9LwZPqGvVCuiJM3hPRB0IA3VKbLVDSwg/exec";

///////////////////////
///// nav function ////
//////////////////////
const searchTicketSelector = document.querySelector(".search-ticket-selector");
const createTicketSelector = document.querySelector(".create-ticket-selector");

const searchTicket = document.querySelector(".search-ticket");
const createTicket = document.querySelector(".create-ticket");

const hidePage = () => {
  searchTicket.classList.add("hidden");
  createTicket.classList.add("hidden");
};
const unselectNav = () => {
  searchTicketSelector.classList.remove("selected");
  createTicketSelector.classList.remove("selected");
};

searchTicketSelector.addEventListener("click", () => {
  if (!searchTicketSelector.classList.contains("selected")) {
    unselectNav();
    searchTicketSelector.classList.add("selected");
    hidePage();
    searchTicket.classList.remove("hidden");
  }
});

createTicketSelector.addEventListener("click", () => {
  if (!createTicketSelector.classList.contains("selected")) {
    unselectNav();
    createTicketSelector.classList.add("selected");
    hidePage();
    createTicket.classList.remove("hidden");
  }
});

///////////////////////
/// login function ///
//////////////////////

const navList = document.querySelector(".page-selector");
const loginPage = document.querySelector(".login-page");
const userNameInput = document.querySelector("#user-name");
const passwordInput = document.querySelector("#password");

const loginBtn = document.querySelector("#login");
const waitingComponent = document.querySelector(".waiting");
const dangerComponent = document.querySelector(".danger");

userNameInput.addEventListener("input", () => {
  dangerComponent.classList.add("hidden");
});
passwordInput.addEventListener("input", () => {
  dangerComponent.classList.add("hidden");
});

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // check blank input
  if (!userNameInput.value || !passwordInput.value) {
    dangerComponent.innerHTML = "Nhập đầy đủ username và password";
    dangerComponent.classList.remove("hidden");
    return;
  }
  waitingComponent.classList.remove("hidden");
  loginBtn.disabled = true
  // send request
  let submitData = {
    type: "login",
    data: {
      user: userNameInput.value,
      password: passwordInput.value,
    },
  };

  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(submitData), // body data type must match "Content-Type" header
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      waitingComponent.classList.add("hidden");
      loginBtn.disabled = false
      handleLogin(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Cập nhật không thành công, hãy thử lại");
      loginBtn.disabled = false

    });
});

const handleLogin = (response) => {
  if (response.status === false) {
    dangerComponent.innerHTML = "Tên đăng nhập hoặc mật khẩu sai";
    dangerComponent.classList.remove("hidden");
    return;
  }

  alert ('Đăng nhập thành công')

  USER_NAME = userNameInput.value;
  USER_TYPE = response.userType;
  IS_LOG_IN = true;
  DATA = response.data;
  SITE = response.user.site;

  loginPage.classList.add("hidden");
  navList.classList.remove("hidden");

  searchTicketSelector.classList.add("selected");
  searchTicket.classList.remove("hidden");
};

const getStrDay = (dateString) => {
  if (dateString.length === 10) {
    return dateString;
  }

  mydate = dateString.slice(0, 10);
  const dd = mydate.slice(8, 10);
  const mm = mydate.slice(5, 7);
  const yyyy = mydate.slice(0, 4);

  return `${dd}/${mm}/${yyyy}`;
};
const compareToday = (dateString) => {
  const today = new Date();
  const mydate = Date.parse(dateString);

  return today > mydate;
};

///////////////////////
/// search function ///
//////////////////////

//handle event when choose single ticket
const singleTicketCheck = document.querySelector(
  ".search-ticket #isSingleTicket"
);
singleTicketCheck.addEventListener("change", () => {
  const searchPhoneInput = document.querySelector(
    ".search-ticket #searchPhone"
  );
  const searchNameInput = document.querySelector(".search-ticket #searchName");
  const valueUsedInput = document.querySelector(".use-ticket-value #usedValue");
  const searchResultElement = document.querySelector(".search-result");
  searchResultElement.innerHTML = "";
  if (singleTicketCheck.checked) {
    searchPhoneInput.value = "";
    searchNameInput.value = "";
    valueUsedInput.value = "";
    searchPhoneInput.classList.add("hidden");
    searchNameInput.classList.add("hidden");
    valueUsedInput.classList.add("hidden");
  } else {
    searchPhoneInput.classList.remove("hidden");
    searchNameInput.classList.remove("hidden");
    valueUsedInput.classList.remove("hidden");
  }
});

const handleSearchTicket = () => {
  const searchPhone = document.querySelector(
    ".search-ticket #searchPhone"
  ).value;
  const searchName = document.querySelector(".search-ticket #searchName").value;
  const searchTicketID = document.querySelector(
    ".search-ticket #searchTicketID"
  ).value;
  const isOD = document.querySelector(".search-ticket #isOD").checked;
  const isSingleTicket = document.querySelector(
    ".search-ticket #isSingleTicket"
  ).checked;
  var ticketList;

  if (isSingleTicket && !isOD) {
    ticketList = DATA.ticketL;
  }
  if (isSingleTicket && isOD) {
    ticketList = DATA.ticketLOD;
  }
  if (!isSingleTicket && !isOD) {
    ticketList = DATA.ticketG;
  }
  if (!isSingleTicket && isOD) {
    ticketList = DATA.ticketGOD;
  }

  if (searchPhone === "" && searchName === "" && searchTicketID === "") {
    ticketlist = [];
  }
  if (searchPhone !== "") {
    ticketList = ticketList.filter(
      (ticket) =>
        String(ticket.phoneNumber)
          .replace(/\s/g, "")
          .slice(-searchPhone.replace(/\s/g, "").length) ===
        searchPhone.replace(/\s/g, "")
    );
  }
  if (searchName !== "") {
    ticketList = ticketList.filter((ticket) =>
      ticket.customerName.toUpperCase().includes(searchName.toUpperCase())
    );
  }
  if (searchTicketID !== "") {
    ticketList = ticketList.filter(
      (ticket) => ticket.ticketID.toUpperCase().slice(-searchTicketID.length) === searchTicketID.toUpperCase()
    );
  }

  const searchResultElement = document.querySelector(".search-result");
  searchResultElement.innerHTML = "";

  if (ticketList.length === 0) {
    searchResultElement.innerHTML =
      '<p class="danger">Không tìm thấy khách hàng</p>';
  }

  if (isSingleTicket) {
    renderTicketL(ticketList, searchResultElement);
  } else {
    renderTicketG(ticketList, searchResultElement);
  }

  const modal = document.querySelector(".use-ticket-value");
  const useBtns = document.querySelectorAll(".action-btns button");
  useBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.remove("hidden");
      TICKET.ID = btn.getAttribute("ticketID");
      TICKET.REMAIN = btn.getAttribute("ticketRemain");
    });
  });
};

const renderTicketG = (ticketList, searchResultElement) => {
  const ticketHistory = (ticket) => {
    var ticketHistoryHtml = "";
    for (let i = 1; i < 16; i++) {
      if (ticket[i] !== "") {
        ticketHistoryHtml += `<p>Lần ${i}: ${ticket[i]}</p>`;
      }
    }
    return ticketHistoryHtml;
  };
  ticketList.forEach((ticket) => {
    searchResultElement.innerHTML =
      `
        <div class="${compareToday(ticket.endDate) ? "out-date" : ""}">
        ${
          compareToday(ticket.endDate)
            ? '<p class="danger">ticket hết hạn</p>'
            : ""
        }
        
        <div class="ticket-id " >
                <label >ticket ID: </label>
                <input  value="${ticket.ticketID}" readonly/>
            </div>
            <div class="ticket-owner">
                <label >Khách hàng: </label>
                <input value="${ticket.customerName}" readonly/>
            </div>
            <div class="phone-number">
                <label >Số điện thoại: </label>
                <input value="${String(ticket.phoneNumber).replace(
                  /\s/g,
                  ""
                )}" readonly/>
            </div>
            <div class="ticket-value">
                <label>Giá trị còn/Tổng: </label>
                <input  value="${ticket.remain}/${ticket.total}" readonly/>
            </div>
            <div class="ticket-date">
                <label >Hạn ticket: </label>
                <input  value="${getStrDay(ticket.endDate)}" readonly/>
        </div>
        <div class="action-btns ${
          compareToday(ticket.endDate) ? "hidden" : ""
        }">
        <button class="use-ticket" ticketID=${ticket.ticketID} ticketRemain=${
        ticket.remain
      }>Sử dụng ticket</button>
        </div>
        <div class="use-history">
            ${ticketHistory(ticket)}
        </div>
        </div>
        ` + searchResultElement.innerHTML;
  });
};

const renderTicketL = (ticketList, searchResultElement) => {
  ticketList.forEach((ticket) => {
    searchResultElement.innerHTML =
      `
        <div class="${compareToday(ticket.endDate) ? "out-date" : ""}">
        ${
          compareToday(ticket.endDate)
            ? '<p class="danger">ticket hết hạn</p>'
            : ""
        }
        
        <div class="ticket-id " >
            <label >ticket ID: </label>
            <input  value="${ticket.ticketID}" readonly/>
        </div>
        <div class="ticket-date">
            <label >Hạn ticket: </label>
            <input  value="${getStrDay(ticket.endDate)}" readonly/>
        </div>
        <div class="ticket-usedate">
            <label >Ngày dùng ticket: </label>
            <input  value="${ticket.useDate == ""? "":getStrDay(ticket.useDate)}" readonly/>
        </div>
        <div class="action-btns ${compareToday(ticket.endDate) ? "hidden" : ""} ${ticket.useDate =="" ? "": "hidden"}
        ">
        <button class="use-ticket" ticketID=${ticket.ticketID} ticketRemain=${
        ticket.remain
      }>Sử dụng ticket</button>
        </div>
        </div>
        ` + searchResultElement.innerHTML;
  });
};

const searchTicketBtn = document.querySelector(".search-ticket button");
searchTicketBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleSearchTicket();
});
// end of search ticket

////////////////////////
/// submit use ticket///
///////////////////////

//prevent submit when press enter
document.querySelector(".use-ticket-value form").onkeypress = function (e) {
  var key = e.charCode || e.keyCode || 0;
  if (key == 13) {
    e.preventDefault();
  }
};

// cancel submit button event
const cancelBtn = document.querySelector(".use-ticket-value .cancel");
cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const modal = document.querySelector(".use-ticket-value");
  modal.classList.add("hidden");
});

// hidden caution when input
const valueEle = document.querySelector(".use-ticket-value input");
valueEle.addEventListener("input", () => {
  const cautionEle = document.querySelector(".use-ticket-value .danger");
  cautionEle.classList.add("hidden");
});

// submit button event
const submitBtn = document.querySelector(".use-ticket-value .submit");
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleSubmitChange(e);
});

// handdle submit change
const handleSubmitChange = (e) => {
  e.preventDefault();
  const modal = document.querySelector(".modal");
  const useTicketValueEle = document.querySelector(".use-ticket-value");
  const value = document.querySelector(".use-ticket-value #usedValue").value;
  const note = document.querySelector(".use-ticket-value #note").value;
  const cautionEle = document.querySelector(".use-ticket-value .danger");
  const isSingleTicket = document.querySelector(
    ".search-ticket #isSingleTicket"
  ).checked;
  var submitData;
  if (isSingleTicket) {
    submitData = {
      type: "change",
      data: {
        ticketType: "single",
        ticketID: TICKET.ID,
        site: SITE,
        usedDate: getToday(),
        usedTime: getTime(),
        usedValue: 1,
        note: note,
      },
    };
  } else {
    if (isNaN(value)) {
      cautionEle.innerHTML = "Nhập đúng số sử dụng";
      cautionEle.classList.remove("hidden");
      return;
    }

    if (value > TICKET.REMAIN * 1) {
      cautionEle.innerHTML = "Giá trị còn lại không đủ";
      cautionEle.classList.remove("hidden");
      return;
    }

    submitData = {
      type: "change",
      data: {
        ticketType: "multi",
        ticketID: TICKET.ID,
        site: SITE,
        usedDate: getToday(),
        usedTime: getTime(),
        usedValue: value,
        note: note,
      },
    };
  }

  modal.classList.remove("hidden");
  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(submitData), // body data type must match "Content-Type" header
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      modal.classList.add("hidden");
      DATA = response.data;
      handleSearchTicket();
      useTicketValueEle.classList.add("hidden");
      document.querySelector(".use-ticket-value #usedValue").value = "";
      document.querySelector(".use-ticket-value #note").value = "";
      alert("Cập nhật thành công");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Cập nhật không thành công, hãy thử lại");
      modal.classList.add("hidden");
    });
};

////////////////////////
/// submit new ticket///
///////////////////////
const createTicketBtn = document.querySelector("#create-ticket");
const inputList = document.querySelectorAll(".create-ticket input");
const cautionEle = document.querySelector(".create-ticket .danger");
const ticketID = document.querySelector("#ticket-id");
const ticketOwner = document.querySelector("#ticket-owner");
const phoneNumber = document.querySelector("#phone-number");
const ticketValue = document.querySelector("#ticket-value");
const ticketDate = document.querySelector("#ticket-date");
const ticketIDStart = document.querySelector("#ticket-id-start");
const ticketIDEnd = document.querySelector("#ticket-id-end");
const createSingleTicket = document.querySelector("#isCreateSingleTicket");

// toggle between single and multi ticket
createSingleTicket.addEventListener("change", () => {
  var listEle1 = [
    ".ticket-id",
    ".ticket-owner",
    ".phone-number",
    ".ticket-value",
  ];
  var listEle2 = [".ticket-id-start", ".ticket-id-end"];
  var createTicketForm = document.querySelector('.ticket-infor-form')
  if (createSingleTicket.checked) {
    listEle1.forEach((item) => {
      createTicketForm.querySelector(item).classList.add("hidden");
    });
    listEle2.forEach((item) => {
      createTicketForm.querySelector(item).classList.remove("hidden");
    });
  } else {
    listEle1.forEach((item) => {
      createTicketForm.querySelector(item).classList.remove("hidden");
    });
    listEle2.forEach((item) => {
      createTicketForm.querySelector(item).classList.add("hidden");
    });
  }
});

// remove cautionEle when input
inputList.forEach((input) => {
  input.addEventListener("input", () => {
    if (cautionEle.classList.contains("hidden")) {
      return;
    }
    cautionEle.classList.add("hidden");
  });
});

// auto copy id start to id end
ticketIDStart.addEventListener('input', ()=>{
    ticketIDEnd.value = ticketIDStart.value
})

// submit event
createTicketBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const modal = document.querySelector(".modal");

  // validate input
  var date_regex = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
  if (!date_regex.test(ticketDate.value)) {
    cautionEle.innerHTML = "Nhập đúng định dạng ngày dd/mm/yyyy";
    cautionEle.classList.remove("hidden");
    return;
  }
  if (isNaN(ticketValue.value)) {
    cautionEle.innerHTML = "Giá trị ticket phải là số";
    cautionEle.classList.remove("hidden");
    ticketValue.value = "";
    return;
  }

  if (DATA.ticketG.map((ticket) => ticket.ticketID).includes(ticketID.value)) {
    cautionEle.innerHTML = "Ticket ID đã tồn tại";
    cautionEle.classList.remove("hidden");
    return;
  }
  if (
    DATA.ticketL.map((ticket) => ticket.ticketID.slice(-ticketIDStart.value.length).toString()).includes(ticketIDStart.value)
  ) {
    cautionEle.innerHTML = "Ticket ID đã tồn tại";
    cautionEle.classList.remove("hidden");
    return;
  }
  if (
    DATA.ticketL.map((ticket) => ticket.ticketID.slice(-ticketIDEnd.value.length).toString()).includes(ticketIDEnd.value)
  ) {
    cautionEle.innerHTML = "Ticket ID đã tồn tại";
    cautionEle.classList.remove("hidden");
    return;
  }
  if(parseInt(ticketIDEnd) < parseInt(ticketIDStart)){
    cautionEle.innerHTML = "Số ticket sau phải lớn hơn hoặc bằng";
    cautionEle.classList.remove("hidden");
    return;
  }

  if (createSingleTicket.checked) {
    if (
      ticketIDStart.value === "" ||
      ticketIDEnd.value === "" ||
      ticketDate.value === ""
    ) {
      cautionEle.innerHTML = "Nhập đủ thông tin trước khi tạo ticket";
      cautionEle.classList.remove("hidden");
      return;
    }
  } else {
    if (
      ticketID.value === "" ||
      ticketOwner.value === "" ||
      phoneNumber.value === "" ||
      ticketValue.value === "" ||
      ticketDate.value === ""
    ) {
      cautionEle.innerHTML = "Nhập đủ thông tin trước khi tạo ticket";
      cautionEle.classList.remove("hidden");
      return;
    }
  }

  // submit
  var submitData;
  if (createSingleTicket.checked) {
    submitData = {
      type: "new",
      data: {
        ticketType: "single",
        ticketIDStart: ticketIDStart.value,
        ticketIDEnd: ticketIDEnd.value,
        ticketDate: ticketDate.value,
        site: SITE,
        creator: USER_NAME,
        createDate: getToday(),
      },
    };
  } else {
    submitData = {
      type: "new",
      data: {
        ticketType: "multi",
        ticketID: ticketID.value,
        ticketOwner: ticketOwner.value,
        phoneNumber: phoneNumber.value,
        ticketValue: ticketValue.value,
        ticketDate: ticketDate.value,
        site: SITE,
        creator: USER_NAME,
        createDate: getToday(),
      },
    };
  }

  modal.classList.remove("hidden");
  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(submitData), // body data type must match "Content-Type" header
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      modal.classList.add("hidden");
      handleSubmitNew(data);
      alert("Cập nhật thành công");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Cập nhật không thành công, hãy thử lại");
      modal.classList.add("hidden");

    });
});

const handleSubmitNew = (response) => {
  DATA = response.data;
  // switch to searchTicket page
  searchTicket.classList.add("selected");
  searchTicket.classList.remove("hidden");
  createTicketSelector.classList.remove("selected");
  createTicket.classList.add("hidden");
  // find ticket to use
  if (createSingleTicket.checked){
    const isSingleTicket = document.querySelector('#isSingleTicket')
    const searchTicketID = document.querySelector('#searchTicketID')
    const searchPhoneInput = document.querySelector(
        ".search-ticket #searchPhone"
      );
    const searchNameInput = document.querySelector(".search-ticket #searchName");
    isSingleTicket.checked = true
    searchPhoneInput.value = ""
    searchNameInput.value = ""
    searchPhoneInput.classList.add('hidden')
    searchNameInput.classList.add('hidden')
    searchTicketID.value = ticketIDStart.value
    handleSearchTicket()
  }else{
      const isSingleTicket = document.querySelector('#isSingleTicket')
      const phoneNo = document.querySelector("#searchPhone");
      isSingleTicket.checked = false
      phoneNo.value = phoneNumber.value;
      handleSearchTicket();
  }

  inputList.forEach((input) => (input.value = ""));
};

const getToday = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "/" + mm + "/" + yyyy;
  return today;
};

const getTime = () => {
  var today = new Date();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return time;
};

// end submit new ticket
