// Publishing royalty breakdown — sample data.
// Logic: each Work has one gross amount, one Agreement (can repeat across works),
// one Publisher, and several Writers. Per writer:
//   gross = work.gross * split%      (split% omitted from UI for now)
//   net   = gross * writerShare%     (writer keeps)
//   pub   = gross - net              (goes to the publisher)
// All sums verified: total gross 850, writers' net 662.50, publisher net 187.50.

export const works = [
  {
    id: 'A',
    name: 'Work A',
    gross: 100,
    agreement: '001',
    publisher: 'Publisher ABC',
    // (writer colors are defined in App.jsx)
    writers: [
      { name: 'Writer A', split: 40, gross: 40, writerShare: 85, net: 34, pubShare: 15, pub: 6 },
      { name: 'Writer B', split: 40, gross: 40, writerShare: 80, net: 32, pubShare: 20, pub: 8 },
      { name: 'Writer C', split: 20, gross: 20, writerShare: 70, net: 14, pubShare: 30, pub: 6 },
    ],
  },
  {
    id: 'B',
    name: 'Work B',
    gross: 250,
    agreement: '002',
    publisher: 'Publisher XYZ',
    writers: [
      { name: 'Writer A', split: 50, gross: 125, writerShare: 60, net: 75, pubShare: 40, pub: 50 },
      { name: 'Writer D', split: 50, gross: 125, writerShare: 70, net: 87.5, pubShare: 30, pub: 37.5 },
    ],
  },
  {
    id: 'C',
    name: 'Work C',
    gross: 500,
    agreement: '001',
    publisher: 'Publisher ABC',
    writers: [
      { name: 'Writer A', split: 80, gross: 400, writerShare: 85, net: 340, pubShare: 15, pub: 60 },
      { name: 'Writer B', split: 20, gross: 100, writerShare: 80, net: 80, pubShare: 20, pub: 20 },
    ],
  },
]

// Global totals — kept static (filters narrow the visible works but do NOT recompute these).
export const totals = { gross: 850, net: 662.5, pub: 187.5 }
