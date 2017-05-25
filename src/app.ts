(function() {
    const width = 1280;
    const height = 720;
    const degrees_to_radians = Math.PI/180;
    let depth = 9;

    class Branch {
        start_x: number;
        start_y: number;
        angle: number;
        length: number;
        cur_length: number;
        split: boolean;
        constructor(start_x: number, start_y: number, angle: number, length: number) {
            this.start_x = start_x;
            this.start_y = start_y;
            this.angle = angle;
            this.length = length;

            this.split = false;
            this.cur_length = 0;
        }
    }

    function main() {
        const canvas = <HTMLCanvasElement> document.getElementById("canvas");
        const context = <CanvasRenderingContext2D> canvas.getContext("2d");
        var angle_mod = 30,
            branches: Branch[] = [];

        canvas.width = width;
        canvas.height = height;

        branches.push(new Branch(
            width / 2,
            height,
            -90,
            100
        ));

        let update = function() {
            if(depth > 0) {
                let new_branches: Branch[] = [];
                let did_split = false;

                branches.forEach((branch) => {
                    if(branch.split === false && branch.cur_length >= branch.length) {
                        branch.split = true;
                        did_split = true;

                        new_branches.push(new Branch(
                            branch.start_x + (branch.length * Math.cos(branch.angle * degrees_to_radians)),
                            branch.start_y + (branch.length * Math.sin(branch.angle * degrees_to_radians)),
                            branch.angle - angle_mod,
                            branch.length - 7.5
                        ));

                        new_branches.push(new Branch(
                            branch.start_x + (branch.length * Math.cos(branch.angle * degrees_to_radians)),
                            branch.start_y + (branch.length * Math.sin(branch.angle * degrees_to_radians)),
                            branch.angle + angle_mod,
                            branch.length - 7.5
                        ));
                    } else if(branch.cur_length < branch.length) {
                        branch.cur_length += 4;
                    }
                });

                if(did_split) {
                    branches = branches.concat(new_branches);
                    depth--;
                }
            }
        };

        let render = function() {
            branches.forEach((branch) => {
                context.beginPath();
                context.moveTo(
                    branch.start_x,
                    branch.start_y
                );
                context.lineTo(
                    branch.start_x + (branch.cur_length * Math.cos(branch.angle * degrees_to_radians)),
                    branch.start_y + (branch.cur_length * Math.sin(branch.angle * degrees_to_radians))
                );
                context.stroke();
            });
        };

        let game_loop = function() {
            update();
            render();
            requestAnimationFrame(game_loop);
        };

        requestAnimationFrame(game_loop);
    }

    window.onload = main;
})();