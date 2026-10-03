const Data = (() => {
    const db = () => SupabaseConfig.client;

    function check(result, message) {
        if (result.error) {
            console.error("[PocketWise]", message, result.error);
            throw result.error;
        }
        return result.data;
    }

    async function profile(user) {
        let result = await db().from("profiles").select("*").eq("id", user.id).maybeSingle();
        check(result, "Unable to load profile");
        if (!result.data) {
            result = await db().from("profiles").upsert({
                id: user.id,
                full_name: user.user_metadata?.full_name || "",
            }).select().single();
            check(result, "Unable to create profile");
        }
        return result.data;
    }

    async function updateProfile(userId, values) {
        const result = await db().from("profiles").update(values).eq("id", userId);
        check(result, "Unable to update profile");
    }

    async function all() {
        const results = await Promise.all([
            db().from("transactions").select("*").order("date", { ascending: false }),
            db().from("budgets").select("*").order("month", { ascending: false }).limit(1).maybeSingle(),
            db().from("savings_goals").select("*").order("created_at", { ascending: false }),
            db().from("money_plans").select("*").order("start_date", { ascending: false }),
            db().from("money_allocations").select("*").order("created_at", { ascending: true }),
            db().from("money_tasks").select("*").order("status", { ascending: true }).order("due_date", { ascending: true }),
        ]);
        results.forEach((result, index) => check(result, "Unable to load workspace data " + index));
        return {
            transactions: results[0].data || [],
            budget: results[1].data || null,
            goals: results[2].data || [],
            plans: results[3].data || [],
            allocations: results[4].data || [],
            tasks: results[5].data || [],
        };
    }

    async function saveTransaction(values, id = null) {
        const query = id
            ? db().from("transactions").update(values).eq("id", id)
            : db().from("transactions").insert(values);
        check(await query, "Unable to save transaction");
    }

    async function deleteTransaction(id) {
        check(await db().from("transactions").delete().eq("id", id), "Unable to delete transaction");
    }

    async function saveBudget(values, id = null) {
        const query = id
            ? db().from("budgets").update(values).eq("id", id)
            : db().from("budgets").insert(values);
        check(await query, "Unable to save budget");
    }

    async function saveGoal(values, id = null) {
        const query = id
            ? db().from("savings_goals").update(values).eq("id", id)
            : db().from("savings_goals").insert(values);
        check(await query, "Unable to save goal");
    }

    async function deleteGoal(id) {
        check(await db().from("savings_goals").delete().eq("id", id), "Unable to delete goal");
    }

    async function savePlan(values, id = null) {
        const query = id
            ? db().from("money_plans").update(values).eq("id", id).select().single()
            : db().from("money_plans").insert(values).select().single();
        return check(await query, "Unable to save plan");
    }

    async function deletePlan(id) {
        check(await db().from("money_plans").delete().eq("id", id), "Unable to delete plan");
    }

    async function replaceAllocations(userId, planId, allocations) {
        check(await db().from("money_allocations").delete().eq("plan_id", planId), "Unable to reset allocations");
        if (!allocations.length) return;
        const rows = allocations.map(item => ({
            user_id: userId,
            plan_id: planId,
            name: item.name,
            planned_amount: Number(item.planned_amount) || 0,
            protected: Boolean(item.protected),
        }));
        check(await db().from("money_allocations").insert(rows), "Unable to save allocations");
    }

    async function saveTask(values, id = null) {
        const query = id
            ? db().from("money_tasks").update(values).eq("id", id)
            : db().from("money_tasks").insert(values);
        check(await query, "Unable to save task");
    }

    async function deleteTask(id) {
        check(await db().from("money_tasks").delete().eq("id", id), "Unable to delete task");
    }

    async function toggleTask(id, status) {
        check(await db().from("money_tasks").update({ status }).eq("id", id), "Unable to update task");
    }

    return {
        profile,
        updateProfile,
        all,
        saveTransaction,
        deleteTransaction,
        saveBudget,
        saveGoal,
        deleteGoal,
        savePlan,
        deletePlan,
        replaceAllocations,
        saveTask,
        deleteTask,
        toggleTask,
    };
})();