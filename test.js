// app.post("/edit", (request, response) => {
//     if (request.body.age == "") {
//         request.body.age = null;
//     }
//     if (request.body.password != "") {
//         bcrypt
//             .hashPassword(request.body.password)
//             .then(pass => {
//                 return db
//                     .updateCommunistWithPasswor(
//                         request.body.name,
//                         request.body.surname,
//                         request.body.email,
//                         pass,
//                         request.session.communistID
//                     )
//                     .then(() => {
//                         return db.updateCommunist_Profile(
//                             request.body.age,
//                             request.body.city,
//                             request.body.homepage,
//                             request.session.communistID
//                         );
//                     })
//                     .then(() => {
//                         response.redirect("/petition/");
//                     })
//                     .catch(err => {
//                         console.log("Err in pass update", err);
//                         response.render("edit", {
//                             layout: "main",
//                             error: "error"
//                         });
//                     });
//             })
//             .catch(err => {
//                 console.log("err with bcrypt in pass update", err);
//                 response.render("edit", {
//                     layout: "main",
//                     error: "error"
//                 });
//             });
//     } else {
//         db.updateCommunistWithoutPassword(
//             request.body.name,
//             request.body.surname,
//             request.body.email,
//             request.session.communistID
//         )
//             .then(() => {
//                 return db.updateCommunist_Profile(
//                     request.body.age,
//                     request.body.city,
//                     request.body.homepage,
//                     request.session.communistID
//                 );
//             })
//             .then(() => {
//                 response.redirect("/petition");
//             })
//             .catch(err => {
//                 console.log("err in update without password", err);
//                 response.render("edit", {
//                     layout: "main",
//                     error: "error"
//                 });
//             });
//     }
// });
