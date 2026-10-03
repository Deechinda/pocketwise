/**
 * Database service.
 *
 * Raw Supabase queries live here so that rendering code does not need to know
 * how PocketWise data is stored. Row Level Security remains the final access
 * control layer for every query.
 */
const Data = (() => {
    function getDatabase() {
        return SupabaseConfig.client;
    }

    function throwIfError(error, context) {
        if (!error) {
            return;
        }

        console.error(`[PocketWise] ${context}:`, error);
        throw error;
    }

    async function runMutation(query, context) {
        const { error } = await query;
        throwIfError(error, context);
    }

    // ========================================
    // Profile
    // ========================================

    async function getProfile(user) {
        let { data: profile, error } = await getDatabase()
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

        throwIfError(error, "Unable to load profile");

        // This fallback supports users created before the profile trigger ran.
        if (!profile) {
            const profileData = {
                id: user.id,
                full_name: user.user_metadata?.full_name || "",
            };

            const result = await getDatabase()
                .from("profiles")
                .upsert(profileData)
                .select()
                .single();

            profile = result.data;
            error = result.error;
            throwIfError(error, "Unable to create profile");
        }

        return profile;
    }

    function updateProfile(userId, fullName) {
        return runMutation(
            getDatabase()
                .from("profiles")
                .update({ full_name: fullName })
                .eq("id", userId),
            "Unable to update profile",
        );
    }

    // ========================================
    // Workspace data
    // ========================================

    async function getAllWorkspaceData() {
        const [transactionsResult, budgetResult, goalsResult] = await Promise.all([
            getDatabase()
                .from("transactions")
                .select("*")
                .order("date", { ascending: false }),
            getDatabase()
                .from("budgets")
                .select("*")
                .order("month", { ascending: false })
                .limit(1)
                .maybeSingle(),
            getDatabase()
                .from("savings_goals")
                .select("*")
                .order("created_at", { ascending: false }),
        ]);

        throwIfError(transactionsResult.error, "Unable to load transactions");
        throwIfError(budgetResult.error, "Unable to load budget");
        throwIfError(goalsResult.error, "Unable to load savings goals");

        return {
            transactions: transactionsResult.data || [],
            budget: budgetResult.data || null,
            goals: goalsResult.data || [],
        };
    }

    // ========================================
    // Transactions
    // ========================================

    function saveTransaction(transactionData, transactionId) {
        const query = transactionId
            ? getDatabase()
                  .from("transactions")
                  .update(transactionData)
                  .eq("id", transactionId)
            : getDatabase().from("transactions").insert(transactionData);

        return runMutation(query, "Unable to save transaction");
    }

    function deleteTransaction(transactionId) {
        return runMutation(
            getDatabase().from("transactions").delete().eq("id", transactionId),
            "Unable to delete transaction",
        );
    }

    // ========================================
    // Budget
    // ========================================

    function saveBudget(budgetData, budgetId) {
        const query = budgetId
            ? getDatabase().from("budgets").update(budgetData).eq("id", budgetId)
            : getDatabase().from("budgets").insert(budgetData);

        return runMutation(query, "Unable to save budget");
    }

    // ========================================
    // Savings goals
    // ========================================

    function saveSavingsGoal(goalData, goalId) {
        const query = goalId
            ? getDatabase().from("savings_goals").update(goalData).eq("id", goalId)
            : getDatabase().from("savings_goals").insert(goalData);

        return runMutation(query, "Unable to save savings goal");
    }

    function deleteSavingsGoal(goalId) {
        return runMutation(
            getDatabase().from("savings_goals").delete().eq("id", goalId),
            "Unable to delete savings goal",
        );
    }

    return {
        profile: getProfile,
        all: getAllWorkspaceData,
        saveTransaction,
        deleteTransaction,
        saveBudget,
        saveGoal: saveSavingsGoal,
        deleteGoal: deleteSavingsGoal,
        updateProfile,
    };
})();
