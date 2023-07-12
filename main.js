const baseUrl = "http://localhost:3000";

function deleteMovie(id) {
  console.log(id);
}

function fetchMovie() {
  $("#load-gif").show();
  $(".table-container").hide();

  $.ajax({
    url: baseUrl + "/movies",
    method: "get",
    headers: {
      access_token: localStorage.access_token,
    },
  })
    .done((data) => {
      $(".table-container").show();

      let HTMLliteral = "";

      data.forEach((el) => {
        let temp = `
                        <tr>
                    <td>
                      <img
                        src="${el.image_url}"
                        style="width: 200px; height: 300px; object-fit: cover"
                      />
                    </td>
                    <td>${el.name}</td>
                    <td onclick="deleteMovie(${el.id})">${el.description}</td>
                  </tr>
                        `;
        HTMLliteral = HTMLliteral + temp;
        //       $("#table-body").append(temp);
      });
      $("#table-body").html(HTMLliteral);
    })
    .fail((err) => {
      console.log(err);
    })
    .always(() => {
      $("#load-gif").hide();
    });
}

$(document).ready(() => {
  // navigation guard

  if (localStorage.access_token) {
    $("#home-page").show();
    $("#login-page").hide();
    fetchMovie();
  } else {
    $("#home-page").hide();
    $("#login-page").show();
  }

  $("#form-login").on("submit", (event) => {
    event.preventDefault();

    let email = $("#input-login-email").val();
    let password = $("#input-login-password").val();

    $.ajax({
      url: baseUrl + "/users/login",
      method: "post",
      data: {
        email,
        password,
      },
    })
      .done((data) => {
        console.log(data); // {access_token: 'asldfjlsd'}
        localStorage.setItem("access_token", data.access_token);
        $("#home-page").show();
        $("#login-page").hide();

        fetchMovie();
      })
      .fail((err) => {
        console.log(err);
      });
  });

  $("#button-logout").on("click", () => {
    localStorage.clear();
    $("#home-page").hide();
    $("#login-page").show();
  });
});
