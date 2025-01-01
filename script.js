const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
/*
const form = $("#modal-2").content.querySelector("#form-id");
form.onsubmit = (e) => {
   e.preventDefault();
   console.log(123);
};
 - code không chạy bởi vì form này là trong thằng #document-fragment
nó không phải của thằng modal => 2 form này khác nhau

=> tư duy theo kiểu click vào thì openModal(tạo ra các phần tử đó) thì mình sẽ return openModal đó và sẽ nhận nó qua biến. rồi truy cập để xử lí bình thường
*/
function Modal() {
   /*
      kỹ thuật cache
   */
   function scrollBarWidth() {
      if (scrollBarWidth.value) {
         return scrollBarWidth.value;
      }
      const div = document.createElement("div");
      Object.assign(div.style, {
         overflow: "scroll",
         position: "absolute",
         top: "-9999px",
      });
      document.body.appendChild(div);
      const scrollWidth = div.offsetWidth - div.clientWidth;
      document.body.removeChild(div);
      scrollBarWidth.value = scrollWidth;
      return scrollWidth;
   }
   this.openModal = (options = {}) => {
      /*
      const scrollBarWidth() =
         window.innerWidth - document.documentElement.clientWidth;
         - Có thể sài cách này để lấy ra scrollbar
      */
      /* 
         Sử dụng destructuring lấy ra 2 thuộc tính trong object
         và closeOfModal là dùng để bật tắt click vào modalBackdrop
      */
      const { templateId, closeOfMOdal = true /* có tắt */ } = options;

      //
      const template = $(`#${templateId}`);
      /*
         Kiểm tra nếu không có templateID thì in ra lỗi
      */
      if (!template) {
         console.error(`${template} does not exits`);
         return;
      }
      const content = template.content.cloneNode(true);
      /*
         - Lý do clone node là muốn sao chép phần tử mà không sao chép các phần tử có sự kiện trong DOM
         - Nó tránh được khi mình ko clone thì thằng #document-fragment nó dịch chuyển vào modalContent thì nó remove thì nó lại bị xóa khởi DOM (không có dụ nó quay lại) 
         ===> lần thứ 2 thì nó sẽ không có nội dung.
      */
      // tao phan  tu
      const modalBackdrop = document.createElement("div");
      modalBackdrop.className = "modal-backdrop";
      const modalContainer = document.createElement("div");
      modalContainer.className = "modal-container";
      const modalCloseBtn = document.createElement("button");
      modalCloseBtn.className = "modal-close";
      modalCloseBtn.innerHTML = "&times";
      const modalContent = document.createElement("div");
      modalContent.className = "modal-content";
      // them element
      modalBackdrop.append(modalContainer);
      modalContainer.append(modalCloseBtn, modalContent);
      modalContent.append(content);
      document.body.append(modalBackdrop);
      setTimeout(() => modalBackdrop.classList.add("show"), 0);
      document.body.classList.add("no-scroll");
      document.body.style.paddingRight = scrollBarWidth() + "px";

      // handle click
      modalCloseBtn.onclick = () => this.closeModal(modalBackdrop);
      if (closeOfMOdal) {
         modalBackdrop.onclick = (e) => {
            if (e.target === modalBackdrop) this.closeModal(modalBackdrop);
         };
      }

      document.addEventListener("keydown", (e) => {
         if (e.key === "Escape") this.closeModal(modalBackdrop);
      });

      return modalBackdrop;
   };
   this.closeModal = (modalBackdrop) => {
      modalBackdrop.classList.remove("show");
      modalBackdrop.ontransitionend = () => {
         modalBackdrop.remove();
         document.body.classList.remove("no-scroll");
         document.body.style.paddingRight = "";
      };
   };
}

const modal = new Modal();
$(".modal-btn-1").onclick = function (e) {
   const modalElement = modal.openModal({
      templateId: "modal-1",
   });
};

$(".modal-btn-2").onclick = function (e) {
   const modalElement = modal.openModal({
      templateId: "modal-2",
      closeOfMOdal: false, // không tắt modal
   });
   $("#form-id").onsubmit = (e) => {
      e.preventDefault();
      const formData = {
         email: $("#email").value.trim(),
         password: $("#password").value.trim(),
      };
      console.log(formData);
   };
};
