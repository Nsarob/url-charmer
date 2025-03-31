/*
Ass models and associations
*/

import User from "./user";
import URL from "./url";

User.hasMany(URL, { foreignKey: "user_id", as:"URLs"})
URL.belongsTo(User, { foreignKey: "user_id", as:"user"})