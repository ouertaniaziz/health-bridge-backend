const express = require('express');
const Material = require('../model/Material');

const addMaterial = async (req, res) => {
    try {
        const material = new Material({
          donation: req.body.donation,
          materialname: req.body.materialname,
          state: req.body.state,
          quantity: req.body.quantity,
        });
        const newMaterial = await material.save();
        res.status(201).json(newMaterial);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
}; 

const getAllMaterials = async (req, res) => {
    try {
        const materials = await Material.find();
        res.json(materials);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
}
}

const updateMaterial = async (req, res) => {
    try {
        const material = await Material.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
        if (!material) {
          return res.status(404).json({ message: 'Material not found' });
        }
        res.json(material);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
};

const getMaterialById = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) {
          return res.status(404).json({ message: 'Material not found' });
        }
        res.json(material);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}

const deleteMaterial = async (req, res) => {
    try {
        const material = await Material.findByIdAndDelete(req.params.id);
        if (!material) {
          return res.status(404).json({ message: 'Material not found' });
        }
        res.json(material);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}

module.exports = {
    addMaterial,
    getAllMaterials,
    getMaterialById,
    updateMaterial,
    deleteMaterial
}