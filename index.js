const express = require("express");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
var db = require("./db");
var bcrypt = require("./bcrypt.js");
var cookieSession = require("cookie-session");
const csrf = require("csurf");
const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.static("./public"));

app.set("view engine", "handlebars");

// Body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.
// Handlebars
app.engine(
    "handlebars",
    handlebars({
        defaultLayout: "main"
    })
);


// Static is serving static files CSS, JS, images

// Protection for form
app.use(
    csrf({
        cookie: true
    })
);

// Cookies session starting
app.use(
    cookieSession({
        secret: `Confused communist.`,
        maxAge: 7000 * 100 * 100 * 100 * 77
    })
);

app.use((request, response, next) => {
    response.setHeader("X-Frame-Options", "DENY");
    response.locals.csrfToken = request.csrfToken();
    next();
});

app.get("/", (request, response) => {
    response.redirect("/register");
});

// XXX register GET
app.get("/register", (request, response) => {
    if (request.session.communistID && request.session.signatureID) {
        response.redirect("/thanks")
    } else {
        response.render("register", {
            layout: "main"
        });
    }
});

// XXX register POST
app.post("/register", (request, response) => {
    if (
        request.body.email != "" &&
        request.body.password != ""
    ) {
        bcrypt.hashPassword(request.body.password).then(hash => {
            request.body.password = hash;
            return db
                .registerCommunist(
                    request.body.email,
                    hash
                )
                .then(data => {
                    console.log("data.rowsh is here:", data.rows[0].id);
                    request.session.communistID = data.rows[0].id;
                    console.log("request session is this :", request.session);
                    return {communistId: data.rows[0].id};
                }).then(({ communistId }) => {
                    return db.initCommnistSignup(communistId);
                }).then(() => {
                    response.redirect("/profile")
                })
                .catch(error => {
                    console.log("ERROR ", error);
                });
        });
    } else {
        response.render("register", {
            layout: "main",
            error: "error"
        });
    }
});

// XXX profile GET
app.get("/profile", (request, response) => {
    if (!request.session.communistID) {
        response.redirect("/register")
    } else {
        response.render("profile", {
            layout: "main"
        })
    }
})

// XXX profile POST
app.post("/profile", (request, response) => {
    return db
        .communistProfile(
            request.body.name,
            request.body.surname,
            request.body.age,
            request.body.city,
            request.body.homepage,
            request.session.communistID
        ).then(result => {
            const communistId = result.rows[0].id;
            return db.updateCommunistSignup(communistId, "USER_DATA_DONE")
        }).then(() => {
            response.redirect("/petition");
        })
        .catch(error => {
            console.log(error);
            response.render("profile", {
                layout: "main",
                error: "error"
            });
        });
});

// XXX edit GET
app.get("/edit", (request, response) => {
    if (!request.session.communistID) {
        response.redirect("/register");
    } else {
        db.getCommunistData(request.session.communistID).then(data => {
            console.log("data :", data);
            response.render("edit", {
                layout: "main",
                edit: data.rows[0]
            });
        });
    }
});


// // XXX edit POST
app.post("/edit", (request, response) => {
    console.log("request.session.communistID vvvv: ", request.session.communistID);
    if (request.body.password == "") {
            console.log(request.body.email)
            console.log(request.session.communistID)
        db.updateCommunistWithoutPassword(
            request.body.email,
            request.session.communistID
        ).then(() => {
            db.updateCommunist_Profile(
                request.body.name,
                request.body.surname,
                request.body.age,
                request.body.city,
                request.body.homepage,
                request.session.communistID
            )
            // XXX: Here update the signup flow, i.e.db.updateCommunistSignup(communistId, "USER_DATA_DONE")
        }).then(() => {
            response.redirect("/thanks/");
        }).catch(error => {
            console.log("error :", error);
        })
    } else {
        bcrypt
            .hashPassword(request.body.password)
            .then(password => {
                return db.updateCommunistWithPassword(
                    request.body.email,
                    password,
                    request.session.communistID
                ).then(() => {
                    return db.updateCommunist_Profile(
                        request.body.name,
                        request.body.surname,
                        request.body.age,
                        request.body.city,
                        request.body.homepage,
                        request.session.communistID
                    )
                }).then(() => {
                    response.redirect("/thanks/");
                }).catch(error => {
                    console.log("error :", error);
                })
            })
    }
})



// XXX petition GET
app.get("/petition", (request, response) => {
    if (!request.session.communistID) {
        response.redirect("/register");
    } else {
        if (!request.session.signatureID) {
            response.render("petition", {
                layout: "main"
            });
        } else {
            response.redirect("/thanks");
        }
    }
});

// XXX petition POST
app.post("/petition", (request, response) => {
    console.log("Request body id jel valja: ", request.session);
    return db
        .whoSigned(
            // request.body.name,
            // request.body.surname,
            request.body.signature,
            request.session.communistID
        ).then(data => {
            console.log("request.session.signatureID : ", request.session.signatureID);
            request.session.signatureID = data.rows[0].id;
        }).then(() => {
            const communistId = request.session.communistID;
            return db.updateCommunistSignup(communistId, "SIGNATURE_DONE");
        }).then(() => {
            response.redirect("/thanks");
        })
        .catch(error => {
            console.log(error);
            response.render("petition", {
                layout: "main",
                error: "error"
            });
        });
});

///XXX thanks GET
app.get("/thanks", (request, response) => {
    if (!request.session.communistID) {
        response.redirect("/register")
    }
    if (!request.session.signatureID) {
        response.redirect("/petition")
    } else {
        let signed = request.session.communistID;
        console.log("request session communistID :", request.session.communistID);
        db.getSignatures(signed).then(data => {
            response.render("thanks", {
                layout: "main",
                getSignatures: data.rows[0].signature
            });
        });
    }
});

///XXX thanks POST
app.post("/thanks", (request, response) => {
    db.deleteSignature(request.session.communistID)
        .then(() => {
            request.session.signatureID = null;
            response.redirect("/petition");
        })
        .catch(err => {
            console.log(err);
        });
});

// XXX /SIGNERS
app.get("/signers", (request, response) => {
    if (!request.session.communistID) {
        response.redirect("/register")
    } else {
        db.getAllCommunists().then(function(data) {
            response.render("signers", {
                layout: "main",
                signers: data.rows
            });
        });
    }
});

// XXX /SIGNERS
app.get("/signers/:city", (request, response) => {
    if (!request.session.communistID) {
        response.redirect("/register");
    } else {
        db.getCity(request.params.city).then(data => {
            response.render("signers", {
                layout: "main",
                signers: data.rows
            });
        });
    }
});

// XXX login GET
app.get("/login", (request, response) => {
    const communistId = request.session.communistID;
    if (communistId) {
        return db.getCommunistSignup(communistId).
            then(result => {
                const registration_step = result.rows[0].step;
                if (registration_step === "USER_DATA_DONE") {
                    response.redirect("/petition");
                } else if (registration_step === "REGISTRATION_DONE") {
                    response.render("profile", {
                        layout: "main"
                    })
                } else {
                    // fallback to somewhere
                }
            });
    } else {
        response.render("login", {
            layout: "main"
        });
    }
});

// XXX login POST
app.post("/login", (request, response) => {
    db.checkEmail(request.body.email)
        .then(data => {
            console.log("Request body email :", request.body.email);
            console.log("tu je id :", data);

            let communistID = data.rows[0].id;
            console.log("request.body.password, data.rows[0].password ;", request.body.password, data.rows[0].password);
            bcrypt
                .checkPassword(request.body.password, data.rows[0].password)
                .then(data => {
                    console.log(
                        "ovo treba:",
                        data
                    );

                    console.log("Email and password are correct:", data);
                    if (data) {
                        request.session.communistID = communistID;
                        db.checkSignature(communistID)
                            .then(data => {
                                if (data.rowCount == 1) {
                                    request.session.signatureID = data.rows[0].id;
                                    response.redirect("/thanks");
                                } else {
                                    response.redirect("/petition");
                                }
                            })
                            .catch(err => {
                                console.log("login sig error", err);
                                return response.render("login", {
                                    layout: "main",
                                    error: "error"
                                });
                            });
                    } else {
                        return response.render("login", {
                            layout: "main",
                            error: "error"
                        });
                    }
                });
        })
        .catch(err => {
            console.log("get pass", err);
            return response.render("login", {
                layout: "main",
                error: "error"
            });
        });
});

// XXX logut GET
app.get("/logout", (request, response) => {
    request.session = null;
    console.log("I am logging out....");
    response.redirect("/register");
});

// Run di server!
app.listen(process.env.PORT || 8080, () =>
    console.log("Communism is coming....!")
);
