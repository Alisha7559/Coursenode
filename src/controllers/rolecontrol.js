const CareerRole = require("../models/rolemodel");

/* ================= CREATE ROLE ================= */
exports.createRole = async (req, res) => {
  try {
   

    const {
      title,
      description,
      level,
      category,
      skillsRequired,
      averageSalary,
      jobOpenings,
      demandLevel,
      recommendedCourses,
      recommendedInstitutions,
      icon,
      isActive,
      createdAt
    } = req.body;

    const role = new CareerRole({
      title,
      description,
      level,
      category,
      skillsRequired,
      averageSalary,
      jobOpenings,
      demandLevel,
      recommendedCourses,
      recommendedInstitutions,
      icon,
      isActive,
      createdAt
    });

    await role.save();
    res.status(201).send("Career role added successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* ================= GET ALL ROLES ================= */
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await CareerRole.find()
      .populate("recommendedCourses")
      .populate("recommendedInstitutions");

    res.status(200).json(roles);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* ================= GET ROLE BY ID ================= */
exports.getRoleById = async (req, res) => {
  try {
    const role = await CareerRole.findById(req.params.id)
      .populate("recommendedCourses")
      .populate("recommendedInstitutions");

    if (!role) {
      return res.status(404).send("Role not found");
    }

    res.status(200).json(role);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* ================= UPDATE ROLE ================= */
exports.updateRole = async (req, res) => {
  try {
    const updatedRole = await CareerRole.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRole) {
      return res.status(404).send("Role not found");
    }

    res.status(200).json({
      message: "Role updated successfully",
      data: updatedRole
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* ================= DELETE ROLE ================= */
exports.deleteRole = async (req, res) => {
  try {
    const deletedRole = await CareerRole.findByIdAndDelete(req.params.id);

    if (!deletedRole) {
      return res.status(404).send("Role not found");
    }

    res.status(200).send("Role deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
