function checkAuthenticated() {
    return (req, res, next) => {
        if(!req.session.email){
            console.error('req.session email required before checking authentication')
            return res.redirect('/verify')
        }
        next()
    }
}

function checkNotAuthenticated(redirectRoute){
    return(req, res, next) => {
        if(!req.session){
            console.error('req.session email required before checking authentication')
            return res.redirect('/verify')
        }

        if (req.session.email) {
            return res.redirect(redirectRoute)
        }
        next()
    }
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated
};