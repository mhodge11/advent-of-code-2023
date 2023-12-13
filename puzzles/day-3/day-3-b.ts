import { readData } from '../../shared.ts';
import chalk from 'chalk';

function getNumberFromPosition(line: string, position: number) {
  let startingPosition = position - 1;
  let endingPosition = position + 1;

  while (true) {
    if (startingPosition < 0) {
      break;
    }

    if (!isNaN(parseInt(line[startingPosition], 10))) {
      startingPosition--;
    } else {
      break;
    }
  }

  while (true) {
    if (endingPosition >= line.length) {
      break;
    }

    if (!isNaN(parseInt(line[endingPosition], 10))) {
      endingPosition++;
    } else {
      break;
    }
  }

  const numberStr = line.slice(startingPosition + 1, endingPosition);

  return parseInt(numberStr, 10);
}

function getPositions(line: string) {
  const numberPositions: number[] = [];
  const symbolPositions: number[] = [];
  const gears: [number, number, number][] = [];

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (!isNaN(parseInt(char, 10))) {
      numberPositions.push(i);
    } else if (char === '*') {
      symbolPositions.push(i);
    }
  }

  symbolPositions.forEach((symbolPosition) => {
    if (
      numberPositions.includes(symbolPosition - 1) &&
      numberPositions.includes(symbolPosition + 1)
    ) {
      const number1 = getNumberFromPosition(line, symbolPosition - 1);
      const number2 = getNumberFromPosition(line, symbolPosition + 1);

      gears.push([number1, number2, symbolPosition]);
    }
  });

  return { numberPositions, symbolPositions, gears };
}

export async function day3b(dataPath?: string) {
  const data = await readData(dataPath);

  data.pop();

  let sum = 0;

  const allLineProperties = data.map((line) => ({
    line,
    ...getPositions(line),
  }));

  const gears: [number, number][] = [];

  allLineProperties.forEach((lineProperties, index) => {
    const prevLineProperties = index > 0 ? allLineProperties[index - 1] : null;
    const nextLineProperties =
      index < allLineProperties.length - 1
        ? allLineProperties[index + 1]
        : null;

    const newGears: [number, number][] = [];

    lineProperties.symbolPositions.forEach((symbolPosition) => {
      const storedGear: [number, number][] = [];

      const gearForThisPosition = lineProperties.gears.find(
        (gear) => gear[2] === symbolPosition
      );
      if (gearForThisPosition) {
        storedGear.push([gearForThisPosition[0], gearForThisPosition[1]]);
      }

      if (prevLineProperties) {
        if (
          prevLineProperties.numberPositions.includes(symbolPosition - 1) &&
          prevLineProperties.numberPositions.includes(symbolPosition + 1) &&
          !prevLineProperties.numberPositions.includes(symbolPosition)
        ) {
          const number1 = getNumberFromPosition(
            prevLineProperties.line,
            symbolPosition - 1
          );
          const number2 = getNumberFromPosition(
            prevLineProperties.line,
            symbolPosition + 1
          );

          storedGear.push([number1, number2]);
        }

        if (prevLineProperties.numberPositions.includes(symbolPosition)) {
          if (lineProperties.numberPositions.includes(symbolPosition - 1)) {
            const number1 = getNumberFromPosition(
              prevLineProperties.line,
              symbolPosition
            );
            const number2 = getNumberFromPosition(
              lineProperties.line,
              symbolPosition - 1
            );

            storedGear.push([number1, number2]);
          }

          if (lineProperties.numberPositions.includes(symbolPosition + 1)) {
            const number1 = getNumberFromPosition(
              prevLineProperties.line,
              symbolPosition
            );
            const number2 = getNumberFromPosition(
              lineProperties.line,
              symbolPosition + 1
            );

            storedGear.push([number1, number2]);
          }
        } else {
          if (prevLineProperties.numberPositions.includes(symbolPosition - 1)) {
            if (lineProperties.numberPositions.includes(symbolPosition - 1)) {
              const number1 = getNumberFromPosition(
                prevLineProperties.line,
                symbolPosition - 1
              );
              const number2 = getNumberFromPosition(
                lineProperties.line,
                symbolPosition - 1
              );

              storedGear.push([number1, number2]);
            }

            if (lineProperties.numberPositions.includes(symbolPosition + 1)) {
              const number1 = getNumberFromPosition(
                prevLineProperties.line,
                symbolPosition - 1
              );
              const number2 = getNumberFromPosition(
                lineProperties.line,
                symbolPosition + 1
              );

              storedGear.push([number1, number2]);
            }
          }

          if (prevLineProperties.numberPositions.includes(symbolPosition + 1)) {
            if (lineProperties.numberPositions.includes(symbolPosition - 1)) {
              const number1 = getNumberFromPosition(
                prevLineProperties.line,
                symbolPosition + 1
              );
              const number2 = getNumberFromPosition(
                lineProperties.line,
                symbolPosition - 1
              );

              storedGear.push([number1, number2]);
            }

            if (lineProperties.numberPositions.includes(symbolPosition + 1)) {
              const number1 = getNumberFromPosition(
                prevLineProperties.line,
                symbolPosition + 1
              );
              const number2 = getNumberFromPosition(
                lineProperties.line,
                symbolPosition + 1
              );

              storedGear.push([number1, number2]);
            }
          }
        }
      }

      if (nextLineProperties) {
        if (
          nextLineProperties.numberPositions.includes(symbolPosition - 1) &&
          nextLineProperties.numberPositions.includes(symbolPosition + 1) &&
          !nextLineProperties.numberPositions.includes(symbolPosition)
        ) {
          const number1 = getNumberFromPosition(
            nextLineProperties.line,
            symbolPosition - 1
          );
          const number2 = getNumberFromPosition(
            nextLineProperties.line,
            symbolPosition + 1
          );

          storedGear.push([number1, number2]);
        }

        if (nextLineProperties.numberPositions.includes(symbolPosition)) {
          if (lineProperties.numberPositions.includes(symbolPosition - 1)) {
            const number1 = getNumberFromPosition(
              nextLineProperties.line,
              symbolPosition
            );
            const number2 = getNumberFromPosition(
              lineProperties.line,
              symbolPosition - 1
            );

            storedGear.push([number1, number2]);
          }

          if (lineProperties.numberPositions.includes(symbolPosition + 1)) {
            const number1 = getNumberFromPosition(
              nextLineProperties.line,
              symbolPosition
            );
            const number2 = getNumberFromPosition(
              lineProperties.line,
              symbolPosition + 1
            );

            storedGear.push([number1, number2]);
          }
        } else {
          if (nextLineProperties.numberPositions.includes(symbolPosition - 1)) {
            if (lineProperties.numberPositions.includes(symbolPosition - 1)) {
              const number1 = getNumberFromPosition(
                nextLineProperties.line,
                symbolPosition - 1
              );
              const number2 = getNumberFromPosition(
                lineProperties.line,
                symbolPosition - 1
              );

              storedGear.push([number1, number2]);
            }

            if (lineProperties.numberPositions.includes(symbolPosition + 1)) {
              const number1 = getNumberFromPosition(
                nextLineProperties.line,
                symbolPosition - 1
              );
              const number2 = getNumberFromPosition(
                lineProperties.line,
                symbolPosition + 1
              );

              storedGear.push([number1, number2]);
            }
          }

          if (nextLineProperties.numberPositions.includes(symbolPosition + 1)) {
            if (lineProperties.numberPositions.includes(symbolPosition - 1)) {
              const number1 = getNumberFromPosition(
                nextLineProperties.line,
                symbolPosition + 1
              );
              const number2 = getNumberFromPosition(
                lineProperties.line,
                symbolPosition - 1
              );

              storedGear.push([number1, number2]);
            }

            if (lineProperties.numberPositions.includes(symbolPosition + 1)) {
              const number1 = getNumberFromPosition(
                nextLineProperties.line,
                symbolPosition + 1
              );
              const number2 = getNumberFromPosition(
                lineProperties.line,
                symbolPosition + 1
              );

              storedGear.push([number1, number2]);
            }
          }
        }
      }

      if (prevLineProperties && nextLineProperties) {
        if (prevLineProperties.numberPositions.includes(symbolPosition)) {
          if (nextLineProperties.numberPositions.includes(symbolPosition)) {
            const number1 = getNumberFromPosition(
              prevLineProperties.line,
              symbolPosition
            );
            const number2 = getNumberFromPosition(
              nextLineProperties.line,
              symbolPosition
            );

            storedGear.push([number1, number2]);
          } else {
            if (
              nextLineProperties.numberPositions.includes(symbolPosition - 1)
            ) {
              const number1 = getNumberFromPosition(
                prevLineProperties.line,
                symbolPosition
              );
              const number2 = getNumberFromPosition(
                nextLineProperties.line,
                symbolPosition - 1
              );

              storedGear.push([number1, number2]);
            }

            if (
              nextLineProperties.numberPositions.includes(symbolPosition + 1)
            ) {
              const number1 = getNumberFromPosition(
                prevLineProperties.line,
                symbolPosition
              );
              const number2 = getNumberFromPosition(
                nextLineProperties.line,
                symbolPosition + 1
              );

              storedGear.push([number1, number2]);
            }
          }
        } else {
          if (prevLineProperties.numberPositions.includes(symbolPosition - 1)) {
            if (nextLineProperties.numberPositions.includes(symbolPosition)) {
              const number1 = getNumberFromPosition(
                prevLineProperties.line,
                symbolPosition - 1
              );
              const number2 = getNumberFromPosition(
                nextLineProperties.line,
                symbolPosition
              );

              storedGear.push([number1, number2]);
            } else {
              if (
                nextLineProperties.numberPositions.includes(symbolPosition - 1)
              ) {
                const number1 = getNumberFromPosition(
                  prevLineProperties.line,
                  symbolPosition - 1
                );
                const number2 = getNumberFromPosition(
                  nextLineProperties.line,
                  symbolPosition - 1
                );

                storedGear.push([number1, number2]);
              }

              if (
                nextLineProperties.numberPositions.includes(symbolPosition + 1)
              ) {
                const number1 = getNumberFromPosition(
                  prevLineProperties.line,
                  symbolPosition - 1
                );
                const number2 = getNumberFromPosition(
                  nextLineProperties.line,
                  symbolPosition + 1
                );

                storedGear.push([number1, number2]);
              }
            }
          }

          if (prevLineProperties.numberPositions.includes(symbolPosition + 1)) {
            if (nextLineProperties.numberPositions.includes(symbolPosition)) {
              const number1 = getNumberFromPosition(
                prevLineProperties.line,
                symbolPosition + 1
              );
              const number2 = getNumberFromPosition(
                nextLineProperties.line,
                symbolPosition
              );

              storedGear.push([number1, number2]);
            } else {
              if (
                nextLineProperties.numberPositions.includes(symbolPosition - 1)
              ) {
                const number1 = getNumberFromPosition(
                  prevLineProperties.line,
                  symbolPosition + 1
                );
                const number2 = getNumberFromPosition(
                  nextLineProperties.line,
                  symbolPosition - 1
                );

                storedGear.push([number1, number2]);
              }

              if (
                nextLineProperties.numberPositions.includes(symbolPosition + 1)
              ) {
                const number1 = getNumberFromPosition(
                  prevLineProperties.line,
                  symbolPosition + 1
                );
                const number2 = getNumberFromPosition(
                  nextLineProperties.line,
                  symbolPosition + 1
                );

                storedGear.push([number1, number2]);
              }
            }
          }
        }
      }

      if (storedGear.length === 1) {
        newGears.push(...storedGear);
      }
    });

    if (newGears.length > 0) {
      console.log(index + 1, newGears);
    }

    gears.push(...newGears);
  });

  gears.forEach((gear) => {
    const [number1, number2] = gear;
    sum += number1 * number2;
  });

  return sum;
}

const answer = await day3b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
