import { body, param, query } from 'express-validator';

export const createFormulaValidator = [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('formula').trim().notEmpty().withMessage('Formula text is required'),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('subject').optional().trim(),
    body('chapter').optional().trim(),
    body('category').optional().isIn(['ALGEBRA', 'GEOMETRY', 'TRIGONOMETRY', 'CALCULUS', 'STATISTICS', 'ARITHMETIC', 'OTHER']),
    body('example').optional().trim().isLength({ max: 2000 }),
    body('tags').optional().isArray(),
    body('studentIds').optional().isArray(),
];

export const updateFormulaValidator = [
    param('id').isMongoId(),
    body('title').optional().trim().isLength({ max: 200 }),
    body('formula').optional().trim(),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('category').optional().isIn(['ALGEBRA', 'GEOMETRY', 'TRIGONOMETRY', 'CALCULUS', 'STATISTICS', 'ARITHMETIC', 'OTHER']),
];

export const formulaIdValidator = [
    param('id').isMongoId().withMessage('Invalid formula ID'),
];

export const formulaQueryValidator = [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('category').optional().isString(),
    query('subject').optional().isString(),
    query('search').optional().trim(),
];
