function drawCharts() {
    $.ajax({
        type: 'GET',
        url: '/chart-data',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            // console.log('Role =>', response.data);
            // company chart
            if (response.status == 422) {
                const ctx = document.getElementById('compChart').getContext('2d');
                const company = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: response.data.map(labels => labels.name),
                        datasets: [{
                            label: 'Company Setup',
                            data: response.data.map(count => count.count),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Company Setup',
                                fontColor: '#000'
                            }
                        }
                    }
                });
                const leaveChart = document.getElementById('leaveChart').getContext('2d');
                const leave = new Chart(leaveChart, {
                    type: 'doughnut',
                    data: {
                        labels: response.leave.map(labels => labels.lable),
                        datasets: [{
                            label: 'Leave status',
                            data: response.leave.map(count => count.no),
                            backgroundColor: [
                                '#4169E1',
                                '#FF6347',
                                '#7B68EE',

                            ],
                            borderColor: [
                                '#E9967A',
                                '#483D8B',
                                '#FFC0CB',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: true
                            },
                            title: {
                                display: false,
                                text: 'Company Setup',
                                fontColor: '#000'
                            }
                        }
                    }
                });

                const monthAttend = document.getElementById('attendChart').getContext('2d');
                const attendMonth = new Chart(monthAttend, {
                    type: 'bar',
                    data: {
                        labels: response.monthAttend.map(labels => labels.month),
                        datasets: [{
                            label: 'Monthly attendance',
                            data: response.monthAttend.map(count => count.attend),
                            backgroundColor: [
                                '##8B008B',
                                '#483D8B',
                                '#E9967A',
                                '#32CD32',
                                '#2E8B57',
                                '#008080',
                                '#4682B4',
                                '#0000FF',
                                '#8B4513',
                                '#2F4F4F',
                                '#FF7F50',
                                '#4B0082',
                            ],
                            borderColor: [
                                '#32CD32',
                                '#2E8B57',
                                '#008080',
                                '#4682B4',
                                '#0000FF',
                                '#8B4513',
                                '#2F4F4F',
                                '#FF7F50',
                                '#4B0082',
                                '#E9967A',
                                '#483D8B',
                                '#FFC0CB',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'x',
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Monthly attendance',
                                fontColor: '#000'
                            }
                        }
                    }
                });

                const genderChart = document.getElementById('genderChart').getContext('2d');
                const gender = new Chart(genderChart, {
                    type: 'pie',
                    data: {
                        labels: response.gend.map(labels => labels.gl),
                        datasets: [{
                            label: 'Gender based',
                            data: response.gend.map(count => count.g),
                            backgroundColor: [
                                '#4169E1',
                                '#FF6347',
                            ],
                            borderColor: [
                                '#E9967A',
                                '#483D8B',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: true
                            },
                            title: {
                                display: true,
                                text: `Gender-based`,
                                fontColor: '#000'
                            }
                        }
                    }
                });

                const userAttendChart = document.getElementById('userAttendChart').getContext('2d');
                const userattendMonth = new Chart(userAttendChart, {
                    type: 'bar',
                    data: {
                        labels: response.user.map(labels => labels.month),
                        datasets: [{
                            label: 'Monthly attendance',
                            data: response.user.map(count => count.attend),
                            backgroundColor: [
                                '##8B008B',
                                '#483D8B',
                                '#E9967A',
                                '#32CD32',
                                '#2E8B57',
                                '#008080',
                                '#4682B4',
                                '#0000FF',
                                '#8B4513',
                                '#2F4F4F',
                                '#FF7F50',
                                '#4B0082',
                            ],
                            borderColor: [
                                '#32CD32',
                                '#2E8B57',
                                '#008080',
                                '#4682B4',
                                '#0000FF',
                                '#8B4513',
                                '#2F4F4F',
                                '#FF7F50',
                                '#4B0082',
                                '#E9967A',
                                '#483D8B',
                                '#FFC0CB',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'x',
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Monthly attendance',
                                fontColor: '#000'
                            }
                        }
                    }
                });
            }
            if (response.status == 500) {
                const leaveChart = document.getElementById('leaveChart').getContext('2d');
                const leave = new Chart(leaveChart, {
                    type: 'doughnut',
                    data: {
                        labels: response.leave.map(labels => labels.lable),
                        datasets: [{
                            label: 'Leave status',
                            data: response.leave.map(count => count.no),
                            backgroundColor: [
                                '#4169E1',
                                '#FF6347',
                                '#7B68EE',

                            ],
                            borderColor: [
                                '#E9967A',
                                '#483D8B',
                                '#FFC0CB',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: true
                            },
                            title: {
                                display: false,
                                text: 'Company Setup',
                                fontColor: '#000'
                            }
                        }
                    }
                });

                const monthAttend = document.getElementById('attendChart').getContext('2d');
                const attendMonth = new Chart(monthAttend, {
                    type: 'bar',
                    data: {
                        labels: response.monthAttend.map(labels => labels.month),
                        datasets: [{
                            label: 'Monthly attendance',
                            data: response.monthAttend.map(count => count.attend),
                            backgroundColor: [
                                '##8B008B',
                                '#483D8B',
                                '#E9967A',
                                '#32CD32',
                                '#2E8B57',
                                '#008080',
                                '#4682B4',
                                '#0000FF',
                                '#8B4513',
                                '#2F4F4F',
                                '#FF7F50',
                                '#4B0082',
                            ],
                            borderColor: [
                                '#32CD32',
                                '#2E8B57',
                                '#008080',
                                '#4682B4',
                                '#0000FF',
                                '#8B4513',
                                '#2F4F4F',
                                '#FF7F50',
                                '#4B0082',
                                '#E9967A',
                                '#483D8B',
                                '#FFC0CB',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'x',
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Monthly attendance',
                                fontColor: '#000'
                            }
                        }
                    }
                });

                const genderChart = document.getElementById('genderChart').getContext('2d');
                const gender = new Chart(genderChart, {
                    type: 'pie',
                    data: {
                        labels: response.gend.map(labels => labels.gl),
                        datasets: [{
                            label: 'Gender based',
                            data: response.gend.map(count => count.g),
                            backgroundColor: [
                                '#4169E1',
                                '#FF6347',
                            ],
                            borderColor: [
                                '#E9967A',
                                '#483D8B',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: true
                            },
                            title: {
                                display: true,
                                text: `Gender-based`,
                                fontColor: '#000'
                            }
                        }
                    }
                });

                const userAttendChart = document.getElementById('userAttendChart').getContext('2d');
                const userattendMonth = new Chart(userAttendChart, {
                    type: 'bar',
                    data: {
                        labels: response.user.map(labels => labels.month),
                        datasets: [{
                            label: 'Monthly attendance',
                            data: response.user.map(count => count.attend),
                            backgroundColor: [
                                '##8B008B',
                                '#483D8B',
                                '#E9967A',
                                '#32CD32',
                                '#2E8B57',
                                '#008080',
                                '#4682B4',
                                '#0000FF',
                                '#8B4513',
                                '#2F4F4F',
                                '#FF7F50',
                                '#4B0082',
                            ],
                            borderColor: [
                                '#32CD32',
                                '#2E8B57',
                                '#008080',
                                '#4682B4',
                                '#0000FF',
                                '#8B4513',
                                '#2F4F4F',
                                '#FF7F50',
                                '#4B0082',
                                '#E9967A',
                                '#483D8B',
                                '#FFC0CB',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'x',
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Monthly attendance',
                                fontColor: '#000'
                            }
                        }
                    }
                });
            }
            if (response.status == 200) {
                const userAttendChart = document.getElementById('userAttendChart').getContext('2d');
                const userattendMonth = new Chart(userAttendChart, {
                    type: 'bar',
                    data: {
                        labels: response.user.map(labels => labels.month),
                        datasets: [{
                            label: 'Monthly attendance',
                            data: response.user.map(count => count.attend),
                            backgroundColor: [
                                '##8B008B',
                                '#483D8B',
                                '#E9967A',
                                '#32CD32',
                                '#2E8B57',
                                '#008080',
                                '#4682B4',
                                '#0000FF',
                                '#8B4513',
                                '#2F4F4F',
                                '#FF7F50',
                                '#4B0082',
                            ],
                            borderColor: [
                                '#32CD32',
                                '#2E8B57',
                                '#008080',
                                '#4682B4',
                                '#0000FF',
                                '#8B4513',
                                '#2F4F4F',
                                '#FF7F50',
                                '#4B0082',
                                '#E9967A',
                                '#483D8B',
                                '#FFC0CB',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'x',
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Monthly attendance',
                                fontColor: '#000'
                            }
                        }
                    }
                });
            }
        },
        error: function(errors) {
            console.log('Dir => ', errors);
            $('#charterror').html('Someting is wrong, chart cannot be displayed ..');
            $('#chart').hide();
        }
    });
}
drawCharts();