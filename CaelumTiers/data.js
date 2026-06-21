// Here you will add your friends. 
// "tiers" object contains their rank in each gamemode.
// Gamemodes: 'overall', 'ltm', 'vanilla', 'uhc', 'pot', 'nethop', 'smp', 'sword', 'axe', 'mace'
// Leave tiers empty if they don't have a rank for that mode.

const playersData = [
    {
        name: "desolatemidnight",
        region: "ASIA",
        subtitle: "Combat Master",
        role: "Combat Master",
        testScore: "6-1",
        overallTier: "HT2",
        pros: "умеет хорошо летать на элитрах, быстрые мувменты, хороший аим, хорошее понимание игры",
        cons: "летать прямо на противника, дает противнику ударить",
        points: 0,
        tiers: { 
            mace: "HT2", 
            smp: "LT5", 
            uhc: "LT4", 
            nethop: "LT2", 
            pot: "HT4", 
            axe: "LT3",
            ltm: "LT5",
            vanilla: "LT5",
            sword: "LT3"
        }
    },
    {
        name: "Prim4ik",
        region: "ASIA",
        subtitle: "Combat Master",
        role: "Combat Master",
        testScore: "12-1",
        overallTier: "LT3",
        pros: "норм аим",
        cons: "не умеет комбить, не держит дистанцию",
        points: 0,
        tiers: { 
            mace: "LT4", 
            smp: "LT5", 
            uhc: "LT1", 
            nethop: "LT3", 
            pot: "LT4", 
            axe: "LT2",
            ltm: "LT5",
            vanilla: "LT5",
            sword: "LT3"
        }
    },
    {
        name: "Zils",
        region: "ASIA",
        subtitle: "Rookie",
        points: 0,
        tiers: { mace: "LT5", smp: "LT5", uhc: "LT5", nethop: "LT5", pot: "LT5", axe: "LT5", ltm: "LT5", vanilla: "LT5", sword: "LT5" }
    },
    {
        name: "MrCurseddolbaeb",
        region: "ASIA",
        subtitle: "Combat Master",
        role: "Combat Master",
        testScore: "6-2",
        overallTier: "HT3",
        pros: "держатие щита вовремя, не дает добить",
        cons: "чуть хуже аим",
        points: 0,
        tiers: { mace: "HT4", smp: "HT3", uhc: "LT5", nethop: "LT5", pot: "LT5", axe: "LT5", ltm: "LT5", vanilla: "LT5", sword: "LT5" }
    },
    {
        name: "Hoxen",
        region: "ASIA",
        subtitle: "Rookie",
        points: 0,
        tiers: { mace: "LT5", smp: "LT5", uhc: "LT5", nethop: "LT5", pot: "LT5", axe: "LT5", ltm: "LT5", vanilla: "LT5", sword: "LT5" }
    },
    {
        name: "yummy_femboys",
        region: "ASIA",
        subtitle: "Rookie",
        points: 0,
        tiers: { mace: "LT5", smp: "LT5", uhc: "LT5", nethop: "LT5", pot: "LT5", axe: "LT5", ltm: "LT5", vanilla: "LT5", sword: "LT5" }
    }
];

// List of all gamemodes for the tabs
const gamemodes = [
    { id: 'overall', name: 'Overall' },
    { id: 'ltm', name: 'LTMs' },
    { id: 'vanilla', name: 'Vanilla' },
    { id: 'uhc', name: 'UHC' },
    { id: 'pot', name: 'Pot' },
    { id: 'nethop', name: 'NethOP' },
    { id: 'smp', name: 'SMP' },
    { id: 'sword', name: 'Sword' },
    { id: 'axe', name: 'Axe' },
    { id: 'mace', name: 'Mace' }
];
