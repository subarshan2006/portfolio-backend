import express from 'express';
import * as formulaController from '../controllers/formulaController.js';
import authenticate from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import {
    createFormulaValidator,
    updateFormulaValidator,
    formulaIdValidator,
    formulaQueryValidator,
} from '../validators/formulaValidator.js';

const router = express.Router();

router.use(authenticate);

router.get('/favorites', formulaController.getFavoriteFormulas);
router.get('/category/:category', formulaController.getFormulasByCategory);
router.get('/', formulaQueryValidator, validate, formulaController.getAllFormulas);
router.post('/', createFormulaValidator, validate, formulaController.createFormula);
router.get('/:id', [...formulaIdValidator], validate, formulaController.getFormulaById);
router.put('/:id', [...formulaIdValidator, ...updateFormulaValidator], validate, formulaController.updateFormula);
router.patch('/:id/favorite', [...formulaIdValidator], validate, formulaController.toggleFavorite);
router.delete('/:id', [...formulaIdValidator], validate, formulaController.deleteFormula);

export default router;
