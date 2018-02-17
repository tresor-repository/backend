export default {
    create: (req, res) => {
        req.assert('email', "Email not valid").isEmail();
        console.log(req.validationErrors());
        res.send(req.body.email);
    }
}