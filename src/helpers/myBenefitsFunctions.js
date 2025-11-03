async function getMyBenefits(userData) {
    try {
        id = userData?.id;
        const data = await authGet(`api/my-benefits/:${id}`);
        return data || [];
    }
    catch (err) {
        throw err;
    }
}