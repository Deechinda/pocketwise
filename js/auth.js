/**
 * Authentication service.
 *
 * All account operations go through Supabase Auth. PocketWise never stores
 * passwords or access tokens itself.
 */
const Auth = (() => {
    function getClient() {
        return SupabaseConfig.client;
    }

    async function getCurrentSession() {
        if (!getClient()) {
            return null;
        }

        const { data, error } = await getClient().auth.getSession();

        if (error) {
            throw error;
        }

        return data.session;
    }

    function signUpUser({ fullName, email, password }) {
        return getClient().auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });
    }

    function signInUser(email, password) {
        return getClient().auth.signInWithPassword({
            email,
            password,
        });
    }

    function signOutUser() {
        return getClient().auth.signOut();
    }

    function sendPasswordReset(email) {
        const redirectUrl = `${location.origin}${location.pathname}#reset-password`;

        return getClient().auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl,
        });
    }

    function updatePassword(password) {
        return getClient().auth.updateUser({ password });
    }

    function onAuthStateChange(callback) {
        return getClient()?.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }

    return {
        session: getCurrentSession,
        signUp: signUpUser,
        signIn: signInUser,
        signOut: signOutUser,
        reset: sendPasswordReset,
        updatePassword,
        onChange: onAuthStateChange,
    };
})();
